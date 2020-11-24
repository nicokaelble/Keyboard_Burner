function setCurrentPage(){
    pathname = window.location.pathname
    


    if(pathname.startsWith("/home")){
        document.getElementById('homeNav').classList.add('active');
    }
    if(pathname.startsWith("/about")){
        document.getElementById('aboutNav').classList.add('active');
    }
    if(pathname.startsWith("/typingtest")){
        document.getElementById('testNav').classList.add('active');
    }
    
}