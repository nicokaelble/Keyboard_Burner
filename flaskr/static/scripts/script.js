//Funktion to visulize active page
function setCurrentPage() {
    pathname = window.location.pathname

    if (pathname.startsWith("/home")) {
        document.getElementById('homeNav').classList.add('active');
    }
    if (pathname.startsWith("/about")) {
        document.getElementById('aboutNav').classList.add('active');
    }
    if (pathname.startsWith("/typingtest")) {
        document.getElementById('testNav').classList.add('active');
    }

}

let showNav = false;

function toggleNavbar(){
    if(showNav){
        console.log("hide")
        //hide navbar
        document.getElementById('navbarOnSmall').hidden = true;

        showNav = false;
    }else{
        console.log("show")
        //show navbar
        document.getElementById('navbarOnSmall').hidden = false;

        showNav = true;
    }
        
    

}

