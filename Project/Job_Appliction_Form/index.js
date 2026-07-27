alert("js added");
const file = document.querySelector("#res");
file.addEventListener("click", () => {
  resume.click();
});
resume.addEventListener("change", (obj) => {
  console.log("obj", obj);
  const doc = obj.target.files[0];
    const doc2 = document.createElement("file");
    file.src = URL.createObjectURL(doc);
});
