const tunnel = require("tunnel-ssh") // npm install tunnel-ssh
const prompt = require("prompt")     // npm install prompt


async function start_server(BRIDGE_HOST, HOST, PORT) {
    prompt.message = "";
    prompt.delimiter = "";
    prompt.start()
    var username = (await prompt.get("UMN Username: "))["UMN Username: "]

    const tunnelOptions = {
        autoClose:false
    }

    const sshOptions = {
        host: BRIDGE_HOST,
        port: 22,
        authHandler: [{
            type: 'keyboard-interactive',
            username: username,
            prompt: async (name, instructions, instructionsLang, prompts, finish) => {
                const result = await Promise.all(prompts.map(async e=>{
                    console.log(e)
                    // if they ask for a password -- give it to them
                    const schema = {
                        properties: {
                            val: {
                                message: e.prompt,
                                required: true,
                                hidden: !e.echo
                            }
                        }
                    };
                    return (await prompt.get(schema)).val
                }));
                finish(result);
            },
        }]
    };

    const serverOptions = {
        port: PORT
    };

    const forwardOptions = {
        dstAddr:HOST,
        dstPort:PORT
    }
   
    let [server, client] = await tunnel.createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);

    // Example how to get the server port information.
    console.log(`SSH tunnel created for ${server.address().port}`)
}

// example usage -- this will ssh into login05, and form there connect the database to your machine.
// start_server('login05.cselabs.umn.edu', 'cse-mysql-classes-01.cse.umn.edu', 3306);
// might need to try different machine
start_server('login04.cselabs.umn.edu', 'cse-mysql-classes-01.cse.umn.edu', 3306);