const $leftLinks = document.querySelectorAll('.left-menu a'),
    $mapLinks = document.querySelectorAll('.map a'),
    $info = document.querySelector('.info'),
    fullmap = document.getElementById("full_map"),
    $svgs = document.querySelectorAll('.map svg');
    $leftcol = document.getElementById("leftcol");
    $rightcol = document.getElementById("rightcol");

function rnd_int(n) {
    return Math.floor(Math.random() * n);
}

function generate_process(n, amp, k) {
    let start = Math.random() * amp;
    let f = [start];
    for (let i = 1; i < n; i++) {
        let tmp = f[i - 1] + (Math.random() - 0.5) * k;
        if (tmp < 0) {
            f.push(tmp + k);
        } else {
            f.push(tmp);
        }
    }
    return f;
}

function generate_used(f, k) {
    let g = [];
    for (let i = 0; i < f.length; i++) {
        let tmp = f[i] - Math.random() * k;
        if (tmp < 0) {
            g.push(tmp + k);
        } else {
            g.push(tmp);
        }
    }
    return g;
}

const requestData = (id) => {
    fetch('data.json')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let dt = data.find((el) => {
                return el.id === id;
            })
            if (dt) {
                $leftcol.innerHTML = `
                    <h1>${dt.district}</h1>
                    <p>${dt.info}</p>`;
                if ('summary' in dt) {
                    let data = dt.summary;
                    // $info.innerHTML += `<table width="100%"><tr><td>`;
                    
                    $leftcol.innerHTML += `<br><h2>Cводка противопожарных мероприятий</h2>
                    План/факт выполнения за год:<br>
                    &nbsp&nbsp&nbsp&nbsp - противопожарные мероприятия: <br>
                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * план: ${data.antifire.plan} <br>
                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * факт: ${data.antifire.fact} <br>
                            &nbsp&nbsp&nbsp&nbsp- финансирвоание: <br>
                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * выделенное: ${data.funding.emitted} руб. <br>
                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * исполнено: ${data.funding.used} руб. <br>
                    &nbsp&nbsp&nbsp&nbsp - количество пожаров на территориях: ${data.numoffires} <br>
                    &nbsp&nbsp&nbsp&nbsp - ущерб: ${data.damage} руб.<br><br>`;

                    // $info.innerHTML += `</td><td>`;
                    $rightcol.innerHTML = `<div class="chart-container" style="width:600px"><canvas id="myChart"></canvas></div>`;
                    // $info.innerHTML += `</td></tr></table>`
                    
                    let years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
                    let funded = generate_process(years.length, 200, 30);
                    let damage = generate_process(years.length, 500, 90);
                    let used = generate_used(funded, 40);


                    var ctx = document.getElementById("myChart");
                    var myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: years,
                            datasets: [{
                                    data: funded,
                                    label: "Средств выделено",
                                    borderColor: "#2f17b6",
                                    fill: false
                                },
                                {
                                    data: used,
                                    label: "Средств потрачено",
                                    borderColor: "#cad61c",
                                    fill: false
                                },
                                {
                                    data: damage,
                                    label: "Ущерб",
                                    borderColor: "#48fc60",
                                    fill: false
                                }
                            ]
                        }
                    });
                    var ctx = document.getElementById("myChart");
                } else {
                    $rightcol.innerHTML = "";
                }
            } else {
                $rightcol.innerHTML = "";
                // $info.innerHTML = `
                //     <h2>No info</h2>
                //     <p>Все данные внизу сгенерированы полностью случайно</p>`;
                //                         $info.innerHTML += `<br><h2>Cводка противопожарных мероприятий</h2>
                //     План/факт выполнения за год:<br>
                //     &nbsp&nbsp&nbsp&nbsp - противопожарные мероприятия: <br>
                //     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * план: ` + rnd_int(10000) + ` <br>
                //     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * факт: ` + rnd_int(10000) + ` <br>
                //             &nbsp&nbsp&nbsp&nbsp- финансирвоание: <br>
                //     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * выделенное:  ` + rnd_int(10000) + ` руб. <br>
                //     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * исполнено:  ` + rnd_int(10000) + ` руб. <br>
                //     &nbsp&nbsp&nbsp&nbsp - количество пожаров на территориях:  ` + rnd_int(10000) + ` <br>
                //     &nbsp&nbsp&nbsp&nbsp - ущерб:  ` + rnd_int(10000) + ` руб.`;
            }
        });
};

requestData("northwest");

$leftLinks.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');
        let color = self.dataset.color;
        let currentElement = document.querySelector(`.map a[href="${selfClass}"]`);
        let currentPolygon = currentElement.querySelectorAll('polygon');
        let currentPath = currentElement.querySelectorAll('path');
        if (currentPolygon) currentPolygon.forEach(el => el.style.cssText = `fill: ${color}; stroke-width: 2px;`);
        if (currentPath) currentPath.forEach(el => el.style.cssText = `fill: ${color}; stroke-width: 2px;`);
        self.classList.add('active');
    });

    el.addEventListener('mouseleave', (e) => {
        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');
        let currentElement = document.querySelector(`.map a[href="${selfClass}"]`);
        let currentPolygon = currentElement.querySelectorAll('polygon');
        let currentPath = currentElement.querySelectorAll('path');
        if (currentPolygon) currentPolygon.forEach(el => el.style.cssText = ``);
        if (currentPath) currentPath.forEach(el => el.style.cssText = ``);
        self.classList.remove('active');
    });

    el.addEventListener('click', (e) => {
        console.log("element clicked");
        e.preventDefault();
        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');
        // let currentElement = document.querySelector(`.left-menu a[href="${selfClass}"]`);
        // let id = currentElement.dataset.id;
        let id = selfClass.slice(1);
        console.log("selfClass = " + selfClass);
        requestData(id);
    });

    el.addEventListener('dblclick', (e) => {
        e.preventDefault();
        let self = e.currentTarget;
        // let selfClass = self.getAttribute('href');
        console.log("dblclick left menu:");
        if (self.parentElement.parentElement.id === "leftlist_district") {
            console.log("dblclick left menu: confirmed");
            let id = self.dataset.id;
            requestData(id);
            document.getElementById("leftlist_district").style.display = 'none';
            document.getElementById("leftlist_" + id).style.display = 'block';

            document.getElementById("full_map").style.display = 'none';
            document.getElementById("svg_" + id).style.display = 'block';
        }
    });

    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        let self = e.currentTarget;
        if (self.parentElement.parentElement.id !== "leftlist_district") {
            let id = self.parentElement.parentElement.dataset.id;
            document.getElementById("svg_" + id).style.display = 'none';;
            document.getElementById("full_map").style.display = 'block';
            document.getElementById("leftlist_district").style.display = 'block';
            document.getElementById("leftlist_" + id).style.display = 'none';
        }
    });
});

$mapLinks.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');
        let color = self.dataset.color;
        let currentElement = document.querySelector(`.left-menu a[href="${selfClass}"]`);
        let currentPolygon = self.querySelectorAll('polygon');
        let currentPath = self.querySelectorAll('path');
        if (currentPolygon) currentPolygon.forEach(el => el.style.cssText = `fill: ${color}; stroke-width: 2px;`);
        if (currentPath) currentPath.forEach(el => el.style.cssText = `fill: ${color}; stroke-width: 2px;`);
        currentElement.classList.add('active');
    });

    el.addEventListener('mouseleave', (e) => {
        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');
        let currentElement = document.querySelector(`.left-menu a[href="${selfClass}"]`);
        let currentPolygon = self.querySelectorAll('polygon');
        let currentPath = self.querySelectorAll('path');
        if (currentPolygon) currentPolygon.forEach(el => el.style.cssText = ``);
        if (currentPath) currentPath.forEach(el => el.style.cssText = ``);
        currentElement.classList.remove('active');
    });

    el.addEventListener('click', (e) => {
        e.preventDefault();
        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');
        let currentElement = document.querySelector(`.left-menu a[href="${selfClass}"]`);
        let firstChild = currentElement.firstChild;
        console.log("firstChild:");
        console.log(firstChild);

        // $info.innerHTML = `
        //     <h2>` + firstChild + `</h2>
        //     <p>Все данные внизу сгенерированы полностью случайно</p>`;
        //                         $info.innerHTML += `<br><h2>Cводка противопожарных мероприятий</h2>
        //     План/факт выполнения за год:<br>
        //     &nbsp&nbsp&nbsp&nbsp - противопожарные мероприятия: <br>
        //     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * план: ` + rnd_int(10000) + ` <br>
        //     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * факт: ` + rnd_int(10000) + ` <br>
        //             &nbsp&nbsp&nbsp&nbsp- финансирвоание: <br>
        //     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * выделенное:  ` + rnd_int(10000) + ` руб. <br>
        //     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp * исполнено:  ` + rnd_int(10000) + ` руб. <br>
        //     &nbsp&nbsp&nbsp&nbsp - количество пожаров на территориях:  ` + rnd_int(10000) + ` <br>
        //     &nbsp&nbsp&nbsp&nbsp - ущерб:  ` + rnd_int(10000) + ` руб.`;

        let id = currentElement.getAttribute('href').slice(1);
        // let id = currentElement.dataset.id;
        requestData(id);
    });

    el.addEventListener('dblclick', (e) => {
        e.preventDefault();
        let self = e.currentTarget;
        if (self.parentElement.id == "full_map") {
            let selfClass = self.getAttribute('href');
            let currentElement = document.querySelector(`.left-menu a[href="${selfClass}"]`);
            let id = currentElement.getAttribute('href').slice(1);

            requestData(id);
            document.getElementById("leftlist_district").style.display = 'none';
            document.getElementById("leftlist_" + id).style.display = 'block';

            document.getElementById("full_map").style.display = 'none';
            document.getElementById("svg_" + id).style.display = 'block';
        }
    });
});

$svgs.forEach(el => {
    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        let self = e.currentTarget;
        if (self.id !== "full_map") {
            self.style.display = 'none';
            document.getElementById("full_map").style.display = 'block';
            let id = self.dataset.id;
            document.getElementById("leftlist_district").style.display = 'block';
            document.getElementById("leftlist_" + id).style.display = 'none';
        }
    });
})