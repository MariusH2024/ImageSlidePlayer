const Storage={
  saveSettings(duration,transition){
    localStorage.setItem("duration",duration);
    localStorage.setItem("transition",transition);
  },
  loadSettings(){
    return {
      duration:localStorage.getItem("duration")||3,
      transition:localStorage.getItem("transition")||"random"
    };
  }
};
