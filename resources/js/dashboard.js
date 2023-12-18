document.addEventListener("DOMContentLoaded", () => {
    const postElements = document.querySelectorAll('[id^=postElement]');
    
    for (let i = 0; i < postElements.length; i++) {
        const post = postElements[i];
        const postID = post.id.replace('postElement','');
        const heartButton = post.querySelector('#heartButton');
        const deleteButton = post.querySelector('#deleteButton');
        const editButton = post.querySelector('#editButton');
        
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
                    post.remove();
                } else if (response.status === 400) {
                    console.log(`Post [${postID}] could not be deleted`)
                } else {
                    throw new Error(`Error: could not delete post with postID: [${postID}]`);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
        })
        
        const editCancelButton = post.querySelector('#cancelEditButton');
        
        editButton.addEventListener('click', () => {
            fetch('/api/checkEditingRights', {
                method: 'PUT',
                body: JSON.stringify({'postID': postID}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    const currentPost = post.querySelector('#currentPost');
                    const editPost = post.getElementsByClassName('editPost')[0];
                
                    if (currentPost.style.display === "none") {
                        currentPost.style.display = "block";
                        editPost.style.display = "none";
                    } else {
                        currentPost.style.display = "none";
                        editPost.style.display = "flex";
                    }
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
        });
        
        // If user clicks edit button again, the original post reappears.
        editCancelButton.addEventListener('click', () => {
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