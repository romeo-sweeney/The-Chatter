// credits to https://stackoverflow.com/questions/65735249/how-to-make-a-css-generated-white-heart-change-its-colour-on-clicking
document.addEventListener("DOMContentLoaded", () => {
    // const heart = document.querySelector(".heart");
    // if (heart) {
    //     heart.onclick = () => heart.classList.toggle("heartClicked");
    // }

    const heartButtons = document.querySelectorAll('button[id^="heartButton"]');
    console.log(heartButtons);
    for (let i = 0; i < heartButtons.length; i++) {
        const heartButton = heartButtons[i];
        heartButton.addEventListener('click', () => {
            const postID = parseInt(heartButton.id.replace('heartButton',''));

            console.log(postID);
            
            fetch('/api/like', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'postID': postID})
            })
            .then((response)=>{
                if (response.status === 200) {
                    const likesNumber = document.getElementById(`likesNumber${postID}`);
                    likesNumber.innerText = parseInt(likesNumber.innerText)+1;
                    const heartImg = document.querySelector(`#heartButton${postID} img`);
                    console.log(heartImg.src);
                    if (heartImg.src.includes('resources/images/whiteHeart.png')) {
                        heartImg.src = 'resources/images/redHeart.png';
                    } else {
                        heartImg.src = 'resources/images/whiteHeart.png'
                    }
                    // document.window.reload();
                } else {
                    throw new Error('Error updating like count');
                }
            })
            .catch(error => {  
                console.error(error.message);
            });
        });
    }



    console.log("Code is running");

    const sorting = document.getElementById('sort');
    
    if (sorting) {
        console.log("Element with ID 'sort' found");
        console.log("Sorting value:", sorting.value);
        sorting.addEventListener('change', ()=> {
            fetch('/api/sortingMethod', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'sortingMethod': sorting.value})
            }).then((response)=>{
                if (response.status === 200) {
                    console.log("Sorting changed")
                    location.reload()

                } else {
                    throw new Error('Error sorting could not be changed.');
                }
            })
            .catch((error) => {
                console.log(error.message);
            })
        });
    } else {
        console.log("Element with ID 'sort' not found");
    }
    
});