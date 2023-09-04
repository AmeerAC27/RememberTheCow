
fetch('top.html')
    .then(response => response.text())
    .then(topContent => {
   
        fetch('bottom.html')
            .then(response => response.text())
            .then(bottomContent => {
               
                document.body.insertAdjacentHTML('afterbegin', topContent);
                
                document.body.insertAdjacentHTML('beforeend', bottomContent);
            })
            .catch(error => console.error('Error loading "bottom.html":', error));
    })
    .catch(error => console.error('Error loading "top.html":', error));