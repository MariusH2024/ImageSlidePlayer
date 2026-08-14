function showScreen(id){
  document.querySelectorAll("section").forEach(section=>{
    section.classList.add("d-none");
  });
  document.getElementById(id).classList.remove("d-none");
}
