// credits to https://stackoverflow.com/questions/65735249/how-to-make-a-css-generated-white-heart-change-its-colour-on-clicking
document.addEventListener("DOMContentLoaded", () => {
    // const heart = document.querySelector(".heart");
    // if (heart) {
    //     heart.onclick = () => heart.classList.toggle("heartClicked");
    // }

    const postElements = document.querySelectorAll('[id^=postElement]');
    
    for (let i = 0; i < postElements.length; i++) {
        const post = postElements[i];
        const postID = post.id.replace('postElement','');
        const heartButton = post.querySelector('#heartButton');
        const deleteButton = post.querySelector('#deleteButton');
        const editButton = post.querySelector('#editButton');

        if (!heartButton) {
            console.log(postID);
        }

        heartButton.addEventListener('click', () => {
            fetch('/api/like', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'postID': postID})
            })
            .then((response)=>{
                if (response.status === 200) {
                    const likesNumber = post.querySelector('#likesNumber');
                    likesNumber.innerText = parseInt(likesNumber.innerText)+1;
                    const heartImg = post.querySelector('#heartImg');
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

        deleteButton.addEventListener('click', () => {
            fetch('/api/deletePost', {
                method: 'DELETE',
                body: JSON.stringify({'postID': postID}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response)=>{
                if (response.status === 200) {
                    console.log(`Post [${postID}] was successfully deleted`);
                    location.reload();
                } else {
                    throw new Error(`Error: could not delete post with postID: [${postID}]`);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
        })

        
        // editButton.addEventListener('click', () => {
        //     const currentPost = post.querySelector('#currentPost');
        //     const editPost = post.getElementsByClassName('editPost')[0];
        //     const editCancelButton = post.querySelector('#cancelEditButton')
            
        //     currentPost.style.display = "none";
        //     editPost.style.display = "flex";

        //     editButton.addEventListener('click', () => {
        //         editPost.style.display = "none";
        //         currentPost.style.display = "block";
        //     });

        //     editCancelButton.addEventListener('click', () => {
        //         editPost.style.display = "none";
        //         currentPost.style.display = "block";
        //     });
        // })

        const editCancelButton = post.querySelector('#cancelEditButton');
        editButton.addEventListener('click', () => {
            const currentPost = post.querySelector('#currentPost');
            const editPost = post.getElementsByClassName('editPost')[0];
        
            if (currentPost.style.display === "none") {
                // If currentPost is hidden, switch to edit mode
                currentPost.style.display = "block";
                editPost.style.display = "none";
            } else {
                // If currentPost is visible, switch to edit mode
                currentPost.style.display = "none";
                editPost.style.display = "flex";
            }
        });
        
        editCancelButton.addEventListener('click', () => {
            // Handle cancel button click to switch back to the original mode
            const currentPost = post.querySelector('#currentPost');
            const editPost = post.getElementsByClassName('editPost')[0];
        
            editPost.style.display = "none";
            currentPost.style.display = "block";
        });
        
    }    


    const sorting = document.querySelector('#sort');
    sorting.addEventListener('change', () => {
        const curSortingValue = sorting.value;
        fetch('/api/sortingMethod', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'sortingMethod': curSortingValue})
        }).then((response)=>{
            if (response.status === 200) {
                console.log("Sorting changed")
                location.reload();
            } else {
                throw new Error('Error sorting could not be changed.');
            }
        })
        .catch((error) => {
            console.log(error.message);
        })
    });
});