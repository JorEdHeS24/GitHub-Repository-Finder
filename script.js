// Selección de elementos del DOM
h2 = document.querySelector(".information h2");          // Selecciona el título
information = document.querySelector(".information");     // Contenedor de información
details = document.querySelector(".details");            // Contenedor de detalles
link_respository = document.querySelector("a");          // Enlace al repositorio
btn_refresh = document.querySelector("button");          // Botón de actualizar
selectlang = document.getElementById("selectlang");      // Selector de lenguajes
info = document.getElementById("info");                  // Contenedor de información
stars = document.getElementById("stars");                // Contador de estrellas
forks = document.getElementById("forks");                // Contador de forks
issues = document.getElementById("issues");              // Contador de issues
watch = document.getElementById("watch");                // Contador de observadores
btn_refresh = document.getElementById("btn_refresh");    // Botón de actualizar

// Fetch inicial para obtener la lista de lenguajes de programación
fetch(
  `https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json`
)
  .then((res) => res.json())
  .then((data) => {
    // Poblar el selector de lenguajes
    for (let i = 1; i < data.length; i++) {
      selectlang.innerHTML += `<option value="${data[i]["title"]}">${data[i]["title"]}</option>`;
    }

    // Evento cuando se cambia el lenguaje seleccionado
    selectlang.addEventListener("change", function () {
      function repos() {
        // Resetear contenido y ocultar elementos
        info.innerHTML = "Loading data...";
        h2.innerHTML = "";
        stars.innerHTML = "";
        forks.innerHTML = "";
        issues.innerHTML = "";
        watch.innerHTML = "";
        h2.classList.add("hide");
        details.classList.add("hide");
          
        // Fetch para obtener repositorios del lenguaje seleccionado
        fetch(
          `https://api.github.com/search/repositories?q=language:${selectlang.value}&sort=stars&order=desc`
        )
          .then((res) => res.json())
          .then((repo) => {
            langName = selectlang.value;
            h2.classList.remove("hide");
            details.classList.remove("hide");

            try {
              setTimeout(() => {
                // Estilos del botón de actualizar
                btn_refresh.style.backgroundColor = "#003";
                btn_refresh.style.color = "#ddd";

                // Eventos hover del botón
                btn_refresh.addEventListener("mouseover", function () {
                  btn_refresh.style.backgroundColor = "#008";
                  btn_refresh.style.color = "#fff";
                  btn_refresh.style.cursor = "pointer";
                });

                btn_refresh.addEventListener("mouseout", function () {
                  btn_refresh.style.backgroundColor = "#003";
                  btn_refresh.style.color = "#ffd";
                });

                // Seleccionar un repositorio aleatorio
                randomRepo = Math.floor(Math.random() * repo.items.length);
                console.log(randomRepo);

                // Manejo de errores y casos especiales
                if (
                  randomRepo == undefined ||
                  randomRepo == null ||
                  randomRepo == NaN
                ) {
                  // Mostrar error si no se puede obtener un repo aleatorio
                  h2.classList.add("hide");
                  details.classList.add("hide");
                  info.innerHTML = "Error fetching repository data.";
                  information.style.backgroundColor = "#f00";
                  btn_refresh.style.backgroundColor = "#444";
                  btn_refresh.style.color = "#333";
                } else if (repo.items.length == 0) {
                  // Mostrar mensaje si no hay repos para el lenguaje
                  h2.classList.add("hide");
                  details.classList.add("hide");
                  info.innerHTML = `No repositories found for <b>${langName}</b>.`;
                  information.style.backgroundColor = "#f00";
                  btn_refresh.style.backgroundColor = "#444";
                  btn_refresh.style.color = "#333";
                } else {
                  // Mostrar información del repositorio seleccionado
                  information.style.backgroundColor = "#ddd";
                  h2.innerHTML = `${repo.items[randomRepo].name}<br>`;
                  link_respository.href = repo.items[randomRepo].html_url;
                  info.innerHTML = `${repo.items[randomRepo].description}<br>`;
                  stars.innerHTML = `<img src="assets/star-svgrepo-com.svg" alt="stars"> ${repo.items[randomRepo].stargazers_count}<br>`;
                  forks.innerHTML = `<img src="assets/fork-svgrepo-com.svg" alt="stars"> ${repo.items[randomRepo].forks_count}<br>`;
                  issues.innerHTML = `<img src="assets/info-circle-svgrepo-com.svg" alt="stars"> ${repo.items[randomRepo].open_issues_count}<br>`;
                  watch.innerHTML = `<img src="assets/watch-svgrepo-com.svg" alt="stars"> ${repo.items[randomRepo].watchers_count}<br>`;
                }
              }, 1000);
            } catch (error) {
              // Manejo de errores generales
              h2.classList.add("hide");
              details.classList.add("hide");
              info.innerHTML = "Error fetching repository data.";
              information.style.backgroundColor = "#f00";
              btn_refresh.style.backgroundColor = "#444";
              btn_refresh.style.color = "#333";
            }
          })
          .catch((err) => {
            // Manejo de errores en el fetch
            h2.classList.add("hide");
            details.classList.add("hide");
            info.innerHTML = "Error fetching repository data.";
            information.style.backgroundColor = "#f00";
            btn_refresh.style.backgroundColor = "#444";
            btn_refresh.style.color = "#333";
          });
      }
      
      // Ejecutar la función inicial
      repos();

      // Evento click para el botón de actualizar
      btn_refresh.addEventListener("click", function () {
        repos();
      });
    });
  });
