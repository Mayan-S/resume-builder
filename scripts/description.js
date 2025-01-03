const descriptionSelect = document.getElementById('description');
let selectedDescription = descriptionSelect.value;

descriptionSelect.addEventListener('change', (event) => {
    selectedDescription = event.target.value;
    console.log('Selected description:', selectedDescription);
});