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
//using html2pdf to generate and download test result
function generatePDF() {
    // Choose the element that our invoice is rendered in.
    const element = document.getElementById("testResult");
    // Choose the element and save the PDF for our user.
    html2pdf()
        .set({ html2canvas: { scale: 4 } })
        .from(element)
        .save("My Typing Certificate");
}

//Format Date to look nice
//2020-11-25 15:30:24    -->  15:30 25th November 2020
function formatDate(uglyDate){
    
}


