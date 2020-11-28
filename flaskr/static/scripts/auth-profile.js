function downloadResult(downloadRowButton) {
    row = parseInt(downloadRowButton.id)

    results = document.getElementById('resultHistory')

    speed = parseInt(results.rows[row].cells[1].innerHTML)
    duration = parseInt(results.rows[row].cells[2].innerHTML)
    mistakes1 = parseInt(results.rows[row].cells[3].innerHTML)
    correctCharacters = parseInt(results.rows[row].cells[4].innerHTML)
    accuracy = parseFloat(results.rows[row].cells[5].innerHTML)
    date = results.rows[row].cells[6].innerHTML

    //fill hiden input elements with test result values
    document.getElementById('speed').value = speed;
    document.getElementById('correctCharacters').value = correctCharacters;
    document.getElementById('mistakes').value = mistakes1;
    document.getElementById('testDuration').value = duration;
    document.getElementById('accuracy').value = accuracy;
    document.getElementById('date').value = date;

    document.getElementById('test').submit();


    //alert("speed:" + speed + "\nduration: " + duration + mistakes1 + correctCharacters + accuracy + date)
}

let hidden = true;
function toggleDataTable() {
    if (hidden) {
        document.getElementById('toggleData').innerHTML = 'HIDE DETAILS <i id="toggleIcon" class="fas fa-chevron-up"></i>';
        document.getElementById('toggleIcon').classList.replace('fa-chevron-down', 'ffa-chevron-up');
        document.getElementById('data').hidden = false;
        hidden = false;
    } else {
        document.getElementById('toggleData').innerHTML = 'MORE DETAILS <i id="toggleIcon" class="fas fa-chevron-down"></i>';
        document.getElementById('toggleIcon').classList.replace('ffa-chevron-up', 'fa-chevron-down');
        document.getElementById('data').hidden = true;
        hidden = true;
    }

}

