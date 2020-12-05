document.getElementById("findDonors").addEventListener('click',getSelectDonors)
document.getElementById("setDonors").addEventListener('click',setDonorName)
document.getElementById("getRecentRequests").addEventListener('click',getRecentRequests)


// show the updated donors
function getSelectDonors(){
    const bloodType = document.getElementById('bloodtype').value
    fetch("/bloodbank/getDonors/"+bloodType.toUpperCase())
    .then(res => {
        if (res.ok){
            res.json()
            .then(data =>{
                 // dynamically clear list elements before adding more
                const selectDonorList = document.getElementById('listOfDonors')
                while(selectDonorList.firstChild){
                    selectDonorList.removeChild(selectDonorList.firstChild)
                }
                // adding list elements
                data.forEach(d =>{
                    const donor = document.createElement('li')
                    donor.appendChild(document.createTextNode(`FirstName: ${d.firstName} | Last Name: ${d.lastName} | Donation Count: ${d.donationCount} | Blood Type: ${d.bloodType}`))
                    selectDonorList.appendChild(donor)
                })
            })
            .catch(err => console.log(err))
        }
        else{
            alert(`${res.status}, invalid input `);
        }
    })
    .catch()

}

function setDonorName(){
    const bloodType = document.getElementById('bloodtype').value
    fetch('/bloodbank/setDonors/'+bloodType,{
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
    })
    .then(res => {
        if (res.ok){
            res.json()
            .then(data =>{
                console.log(data)
                })
            .catch(err => console.log("failed to get object"))
        }
        else{
            alert(`${res.status}, invalid Input`);
        }
    })
    .catch()
}

function getRecentRequests(){
    fetch("/bloodbank/recentRequests")
    .then(res => {
        if (res.ok){
            res.json()
            .then(data =>{
                 // dynamically make list elements
                const selectRequestList = document.getElementById('listOfRequests')
                while(selectRequestList.firstChild){
                    selectRequestList.removeChild(selectRequestList.firstChild)
                }
                data.forEach(r =>{
                    const request = document.createElement('li')
                    request.appendChild(document.createTextNode(`Request ID: ${r.requestID} | Request Date: ${r.requestDate} | Hospital Name: ${r.hospitalName} | Street Address: ${r.streetAddress} | City: ${r.city} | Postal Code: ${r.postalCode}`))
                    selectRequestList.appendChild(request)
                })
            })
            .catch(err => console.log(err))
        }
        else{
            alert(`${res.status}, invalid input `);
        }
    })
    .catch()

}
