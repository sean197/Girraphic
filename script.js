document.addEventListener('DOMContentLoaded', fetchData, false);
const tableData = document.querySelector("#table-data"); // Table Body
const headerText = document.querySelector("#header");
let data, table, sortCol;
let sortAsc = false;

// fetch Data
async function fetchData(){
    const response = await fetch("MarathonResults.json");
    data = await response.json();
    const athletes = data.results.athletes;
    const text = data.results;

    renderingTable()

    document.querySelectorAll("#table-sort thead th")
    .forEach(tableHeader => {
        tableHeader.addEventListener("click", ()=>{
            tableHeader.addEventListener('click', sort, false);
        });
    }
    
    )

    const headers = ["Rank", "Name", "Finish Time", "Country Code"];

    //Header Text
    headerText.innerHTML = `The official results of the ${text.gender} ${text.racelength}km ${text.racename} `

    const body = athletes.map((item) => ({
    rank: item.rank,
    name: item.firstname + " " + item.surname,
    finishTime: item.finishtime,
    countryCode: item.flag
    }));

    // CSV
    const csvData = [headers, ...body].map(row => Object.values(row).join(",")).join("\n");

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8,' })

    const objUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', objUrl)
    link.setAttribute('role', "button")
    link.setAttribute('class', "btn btn-warning")
    link.setAttribute('download', 'race_results.csv')
    link.textContent = 'Click to Download CSV'

    document.querySelector('#btn').append(link)


}

// Render Table
function renderingTable(){
    let out = "";
    const athletes = data.results.athletes;
    athletes.forEach(athlete => {
        const name = athlete.firstname + " " + athlete.surname
        out += `
            <tr>
                    <td>${athlete.rank}</td>
                    <td>${ name }</td>
                    <td>${athlete.finishtime}</td>
                    <td>${athlete.countryname}</td>
                    <td>${athlete.flag}</td>
                    <td>${athlete.athleteid}</td>
                    <td>${athlete.teamname}</td>
                    <td>${athlete.bibnumber}</td>
                    <td>${athlete.raceprogress}</td>
            </tr>
        `
    });

    tableData.innerHTML = out;
}
    

// Sort Column
function sort(e) {
    let thisSort = e.target.dataset.sort;
    const athletes = data.results.athletes;

    if(sortCol === thisSort) sortAsc = !sortAsc;
    sortCol = thisSort;
    athletes.sort((a, b) => {
      if(a[sortCol] < b[sortCol]) return sortAsc?1:-1;
      if(a[sortCol] > b[sortCol]) return sortAsc?-1:1;
      return 0;
    });
    renderingTable();
  }