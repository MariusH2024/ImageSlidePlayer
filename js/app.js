const folder=document.getElementById("folder");
const folderName=document.getElementById("folderName");
const duration=document.getElementById("duration");
const transition=document.getElementById("transition");
const start=document.getElementById("start");
const previewImage=document.getElementById("previewImage");
const stats=document.getElementById("stats");

const settings=Storage.loadSettings();
duration.value=settings.duration;
transition.value=settings.transition;

folder.onchange=()=>{
  images=[...folder.files].filter(file=>file.type.startsWith("image/"));
  images.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:"base"}));

  if(!images.length){
    folderName.textContent="Aucune image valide";
    previewImage.style.display="none";
    stats.textContent="";
    start.disabled=true;
    return;
  }

  const firstPath=images[0].webkitRelativePath || images[0].name;
  const folderLabel=firstPath.includes("/")?firstPath.split("/")[0]:"Dossier sélectionné";

  folderName.textContent=`${folderLabel} — ${images.length} image(s)`;
  previewImage.src=URL.createObjectURL(images[0]);
  previewImage.style.display="block";

  const totalBytes=images.reduce((sum,file)=>sum+file.size,0);
  const formats=[...new Set(images.map(file=>file.name.split(".").pop().toUpperCase()))];

  stats.innerHTML=`${images.length} image(s) • ${(totalBytes/1024/1024).toFixed(1)} Mo<br>${formats.join(" • ")}`;
  start.disabled=false;
};

duration.onchange = () => {

    const value =
        Math.max(
            1,
            Number(duration.value) || 3
        );

    duration.value = value;

    Storage.saveSettings(
        value,
        transition.value
    );

};


transition.onchange=()=>{
  Storage.saveSettings(duration.value,transition.value);
};

start.onclick=()=>{
  if(!images.length)return;
  showScreen("playerScreen");
  startPlayer();
};

document.getElementById("aboutLink").onclick=e=>{
  e.preventDefault();
  showScreen("aboutScreen");
};

document.getElementById("backBtn").onclick=()=>{
  showScreen("homeScreen");
};
if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(
                    registration => {

                        console.log(
                            "Service Worker enregistré :",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "Erreur Service Worker :",
                            error
                        );

                    }
                );

        }
    );

}
