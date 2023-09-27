function populate(file_name) {
            fetch(file_name)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.location.city == "Zurich") {
                        var location = document.getElementById("zurich");
                    } else if (data.location.city == "Lausanne") {
                        var location = document.getElementById("lausanne");
                    } else if (data.location.city == "Basel") {
                        var location = document.getElementById("basel");
                    }
                    data.timeline.forEach(function(item, i){
                        if (item.type == "workshop") {
                            item.workshops.forEach(function(witem){
                                if (witem.presentations != "") {
                                    var wcell = document.createElement('div');
                                    var speakers = Array.isArray(witem.speaker) ? witem.speaker : [witem.speaker];
                                    var linked_speakers = speakers.map(function(speaker){
                                        return `${speaker.name}</a>`;
                                    }).join(';&nbsp;');
                                    var presentations = Array.isArray(witem.presentations) ? witem.presentations : [witem.presentations];
                                    var linked_presentations = presentations.map(function(presentation){
                                        return `<a class="btn btn-outline-base-color btn-small margin-2 no-margin-rl no-margin-top" href="${presentation.link}" target="_blank">${presentation.name}</a>`;
                                    }).join('&nbsp;');
                                    wcell.innerHTML = `
                                        <h3 class="text-base-color font-family-alt font-weight-700 letter-spacing-1 title-small">${witem.title}</h3>
                                        <p class="text-gray-dark-2 text-large-2">${linked_speakers}</p>
                                        ${linked_presentations}
                                    `;
                                    location.appendChild(wcell);
                                }
                            });
                        } else {
                            if (item.presentations != "") {
                                var cell = document.createElement('div');
                                var speakers = Array.isArray(item.speaker) ? item.speaker : [item.speaker];
                                var linked_speakers = speakers.map(function(speaker){
                                    return `${speaker.name}</a>`;
                                }).join(';&nbsp;');
                                var presentations = Array.isArray(item.presentations) ? item.presentations : [item.presentations];
                                var linked_presentations = presentations.map(function(presentation){
                                    return `<a class="btn btn-outline-base-color btn-small margin-2 no-margin-rl no-margin-top" href="${presentation.link}" target="_blank">${presentation.name}</a>`;
                                }).join('&nbsp;');
                                cell.innerHTML = `
                                    <h3 class="text-base-color font-family-alt font-weight-700 letter-spacing-1 title-small">${item.title}</h3>
                                    <p class="text-gray-dark-2 text-large-2">${linked_speakers}</p>
                                    ${linked_presentations}
                                `;
                                location.appendChild(cell);
                            }
                        }
                    });
                });
}
