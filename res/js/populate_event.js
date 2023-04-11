function populate(file_name) {
            fetch(file_name)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    // Add the the date to the page, format : From HH:MM to HH:MM, <br> DD.MM.YYYY (2 digits for hours, minutes, days, months and 4 digits for year)
                    // Get the start and end dates as date objects
                    var startDate = new Date(data.start);
                    var endDate = new Date(data.end);

                    document.getElementById('title').innerHTML = data.title;
                    // Add the details to the page
                    document.getElementById('details').innerHTML = startDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) + ', ' + data.location.name + ', ' + data.location.address;
                    // Add the description to the page
                    document.getElementById('description').innerHTML = data.description;

                    document.getElementById('event-day').innerHTML = startDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
                    document.getElementById('event-date').innerHTML = ('0' + startDate.getDate()).substr(-2) + '.' + ('0' + (startDate.getMonth() + 1)).substr(-2) + '.' + startDate.getFullYear() + ' <br />' + ('0' + startDate.getHours()).substr(-2) + ':' + ('0' + startDate.getMinutes()).substr(-2) + ' - ' + ('0' + endDate.getHours()).substr(-2) + ':' + ('0' + endDate.getMinutes()).substr(-2);
                    // Add the location name to the page
                    document.getElementById('event-location-name').innerHTML = data.location.name;
                    // Add the location address to the page
                    document.getElementById('event-location-address').innerHTML = data.location.address;
                    // Add an anchor div to the location address to link to google maps search
                    document.getElementById('event-location-address').innerHTML = '<a href="https://www.google.com/maps/search/?api=1&query=' + data.location.address + '" target="_blank">' + document.getElementById('event-location-address').innerHTML + '</a>';


                    // Add the iframe url to the map
                    document.getElementById('event-location-map').src = data.location.iframe_url;


                    data.timeline.forEach(function(item, i){
                        // Add the event to the timeline as a new row in the timeline-schedule table
                        var row = document.createElement('tr');
                        row.className = "inner-box";
                        if (item.type == "presentation") {
                            var titleClass = "text-base-color";
                        } else if (item.type == "workshop") {
                            var titleClass = "text-base-color";
                        } else {
                            row.classList.add("bg-gray-light-2");
                            var titleClass = "text-light-color";
                        }
                        var duration = item.end - item.start;
                        if (item.type == "workshop") {
                            row.innerHTML = `
                            <th scope="row">
                                <div class="event-time">
                                    <p class="font-weight-300 text-gray-dark-2">${item.start} - ${item.end}</p>
                                </div>
                            </th>
                            <td class="workshop" colspan="2">
                                <table class="table table-workshop">
                                    <thead class="bg-gray-light text-gray-dark">
                                        <tr>
                                            <th colspan="${item.workshops.length}">Parallel workshops</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr id="workshop-schedule-${i}">
                                <!-- Will be populated by the script -->
                                </tr>
                                </tbody>
                                </table>
                                </td>
                            `;
                            document.getElementById('timeline-schedule').appendChild(row);
                            item.workshops.forEach(function(witem){
                                var wcell = document.createElement('td');
                                material_div = witem.material_link != '' ? `
                                    <div class="categories material">
                                    <a href="${witem.material_link}">Material</a>
                                    </div>
                                ` : '';
                                var speakers = Array.isArray(witem.speaker) ? witem.speaker : [witem.speaker];
                                var linked_speakers = speakers.map(function(speaker){
                                    return `<a href="#${speaker.name}">${speaker.name}</a>`;
                                }).join(';&nbsp;');
                                wcell.className = "col-sm-" + 12/item.workshops.length;
                                wcell.innerHTML = `
                                    <div class="event-wrap">
                                    <h3 class="text-base-color">${witem.title}</h3>
                                    <div class="meta">
                                    <div class="organizers">${linked_speakers}</div>
                                    ${witem.material_link != '' ? "<div class='categories material'><a href='" + witem.material_link + "'>Material</a></div>" : ""}
                                    </div>
                                    <div class="font-weight-300 text-gray-dark-2">
                                ${speakers.map(speaker => speaker.description).join(';&nbsp;')}
                                    </div>
                                    </div>
                                    <div class="r-no">
                                    <span>
                                ${witem.description}
                                    </span>
                                    </div>
                                    <div class="event-location">
                                    <p class="room font-weight-300 text-gray-dark-2">
                                    <i class="fa fa-map-marker text-gray"></i> ${witem.location.name}
                                    </p>
                                    </div>
                                    </div>
                                `;
                                document.getElementById('workshop-schedule-' + i).appendChild(wcell);
                                // Add the speaker to the speaker section
                                // Check if the speaker is a list of speakers
                                var speakers = Array.isArray(witem.speaker) ? witem.speaker : [witem.speaker];
                                speakers.forEach((speaker_obj) => {
                                    console.log(speaker_obj);
                                    if (speaker_obj.name !== "" && speaker_obj.name !== "TBC" && document.getElementById(speaker_obj.name) == null) {
                                        var speaker = document.createElement('div');
                                        speaker.className = "member-box col-xs-6 col-sm-4 col-md-3";
                                        speaker.id = speaker_obj.name;
                                        speaker.innerHTML = `
                                            <div class="overflow-hidden position-relative width-100">
                                            <div class="position-relative">
                                            <img src="${speaker_obj.photo}" alt="${speaker_obj.name}" class="img-fluid">
                                            </div>
                                            <div class="bg-gray-light no-padding-rl padding-6 position-relative text-center">
                                            <span class="display-block font-family-alt font-weight-700 letter-spacing-2 text-gray-dark-2 text-small text-uppercase">
                                        ${speaker_obj.name}
                                            </span>
                                            <span class="display-block margin-2 no-margin-rl no-margin-bottom font-weight-400 letter-spacing-1 text-gray-dark text-extra-small">
                                        ${speaker_obj.description}
                                            </span>
                                            </div>
                                            </div>
                                        `;
                                        if (speaker_obj.link !== ''){
                                            speaker.innerHTML = `
                                                <a href="${speaker_obj.link}" target="_blank">
                                            ${speaker.innerHTML}
                                                </a>
                                            `
                                        }
                                        document.getElementById('speakers-grid').appendChild(speaker);
                                    }});
                            });
                        } else {
                            var speakers = Array.isArray(item.speaker) ? item.speaker : [item.speaker];
                            var linked_speakers = speakers.map(function(speaker){
                                return `<a href="#${speaker.name}">${speaker.name}</a>`;
                            }).join(';&nbsp;');
                            row.innerHTML = `
                                <th scope="row">
                                <div class="event-time">
                                <p class="font-weight-300 text-gray-dark-2">${item.start} - ${item.end}</p>
                                </div>
                                </th>
                                <td>
                                <div class="event-wrap">
                                <h3 class="${titleClass}">${item.title}</h3>
                                <div class="meta">
                                <div class="organizers">
                                ${linked_speakers}
                                </div>
                                    ${item.material_link != '' ? `
                                        <div class="categories material">
                                            <a href="${item.material_link} target="_blank">Material</a>
                                        </div>
                                    ` : ''}
                                <div class="font-weight-300 text-gray-dark-2">
                            ${speakers.map(speaker => speaker.description).join(';&nbsp;')}
                                </div>
                                </div>
                                <div class="r-no">
                                <span>
                            ${item.description}
                                </span>
                                </div>
                                </div>
                                </td>
                                <td class="event-location">
                                <div class="meta">
                                ${item.location.name != '' ? `
                                    <p class="room font-weight-300 text-gray-dark-2">
                                        ${item.location.url != '' ? `
                                        <a href="${item.location.url}" target="_blank">
                                            <i class="fa fa-map-marker text-gray"></i> ${item.location.name}
                                        </a>
                                        ` : `
                                            <i class="fa fa-map-marker text-gray"></i> ${item.location.name}
                                        `}
                                    </p>
                                ` : ''}
                                </div>
                                </td>
                            `;
                            document.getElementById('timeline-schedule').appendChild(row);
                            // Add the speaker to the speaker section
                            var speakers = Array.isArray(item.speaker) ? item.speaker : [item.speaker];
                            speakers.forEach((speaker_obj) => {
                                console.log(speaker_obj);
                                if (speaker_obj.name !== "" && speaker_obj.name !== "TBC" && document.getElementById(speaker_obj.name) == null) {
                                    var speaker = document.createElement('div');
                                    speaker.className = "member-box col-xs-6 col-sm-4 col-md-3";
                                    speaker.id = speaker_obj.name;
                                    speaker.innerHTML = `
                                        <div class="overflow-hidden position-relative width-100">
                                        <div class="position-relative">
                                        <img src="${speaker_obj.photo}" alt="${speaker_obj.name}" class="img-fluid">
                                        </div>
                                        <div class="bg-gray-light no-padding-rl padding-6 position-relative text-center">
                                        <span class="display-block font-family-alt font-weight-700 letter-spacing-2 text-gray-dark-2 text-small text-uppercase">
                                    ${speaker_obj.name}
                                        </span>
                                        <span class="display-block margin-2 no-margin-rl no-margin-bottom font-weight-400 letter-spacing-1 text-gray-dark text-extra-small">
                                    ${speaker_obj.description}
                                        </span>
                                        </div>
                                        </div>
                                    `;
                                    if (speaker_obj.link !== ''){
                                        speaker.innerHTML = `
                                            <a href="${speaker_obj.link}" target="_blank">
                                        ${speaker.innerHTML}
                                            </a>
                                        `
                                    }
                                    document.getElementById('speakers-grid').appendChild(speaker);
                                }});
                        }
                    });
                });
}
