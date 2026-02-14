const canvas = document.createElement("canvas");
canvas.id = "bgCanvas";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 70;

for(let i=0;i<PARTICLE_COUNT;i++){
    particles.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        vx:(Math.random()-0.5)*0.5,
        vy:(Math.random()-0.5)*0.5,
        size:Math.random()*2+1
    });
}

function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{
        p.x+=p.vx;
        p.y+=p.vy;

        if(p.x<0||p.x>canvas.width)p.vx*=-1;
        if(p.y<0||p.y>canvas.height)p.vy*=-1;

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle="rgba(0,120,255,0.7)";
        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}
animateParticles();


const gradient = document.createElement("div");
gradient.className="gradient-overlay";
document.body.appendChild(gradient);

document.addEventListener("mousemove",(e)=>{
    document.body.style.setProperty("--x",e.clientX+"px");
    document.body.style.setProperty("--y",e.clientY+"px");
});

document.addEventListener("touchmove",(e)=>{
    document.body.style.setProperty("--x",e.touches[0].clientX+"px");
    document.body.style.setProperty("--y",e.touches[0].clientY+"px");
});


document.addEventListener("DOMContentLoaded",()=>{
    if(document.getElementById("aulasContainer")){
        renderAulas();
        document.getElementById("busca")
        .addEventListener("input",filtrarAulas);
    }

    if(document.getElementById("calendarGrid")){
        renderCalendario();
    }
});

function renderAulas(lista=aulas){
    const container=document.getElementById("aulasContainer");
    container.innerHTML="";
    lista.forEach(aula=>{
        const div=document.createElement("div");
        div.className="card";
        div.innerHTML=`
            <img src="${aula.imagem}">
            <h3>${aula.titulo}</h3>
            <p>${aula.data}</p>
            <p>${aula.professor}</p>
        `;
        div.onclick=()=>abrirModalAula(aula);
        container.appendChild(div);
    });
}

function filtrarAulas(e){
    const texto=e.target.value.toLowerCase();
    const filtradas=aulas.filter(a=>
        a.titulo.toLowerCase().includes(texto) ||
        a.professor.toLowerCase().includes(texto) ||
        a.categoria.toLowerCase().includes(texto)
    );
    renderAulas(filtradas);
}

function abrirModalAula(aula){
    const modal=document.createElement("div");
    modal.className="modal-overlay";
    modal.innerHTML=`
        <div class="modal">
            <h2>${aula.titulo}</h2>
            <img src="${aula.imagem}" style="width:100%;border-radius:15px;margin:15px 0;">
            <p><strong>Data:</strong> ${aula.data}</p>
            <p><strong>Professor:</strong> ${aula.professor}</p>
            <p style="margin-top:15px;">${aula.descricao}</p>
            <button onclick="this.closest('.modal-overlay').remove()"
            style="margin-top:20px;padding:10px 20px;border:none;border-radius:10px;background:#0077ff;color:white;cursor:pointer;">
            Fechar
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}


let mesAtual = new Date().getMonth();

function mudarMes(valor){
    mesAtual += valor;
    if(mesAtual<0)mesAtual=11;
    if(mesAtual>11)mesAtual=0;
    renderCalendario();
}

function renderCalendario(){
    const grid=document.getElementById("calendarGrid");
    const mesNome=document.getElementById("mesAtual");
    if(!grid) return;

    grid.innerHTML="";
    const year=2026;

    mesNome.textContent=
        new Date(year,mesAtual)
        .toLocaleString('pt-BR',{month:'long',year:'numeric'});

    const primeiro=new Date(year,mesAtual,1).getDay();
    const dias=new Date(year,mesAtual+1,0).getDate();

    for(let i=0;i<primeiro;i++)
        grid.innerHTML+="<div></div>";

    for(let dia=1;dia<=dias;dia++){

        const data=`2026-${String(mesAtual+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
        const eventosDia=eventos.filter(e=>e.data===data);

        const div=document.createElement("div");
        div.className="calendar-day";
        div.innerHTML=`<span>${dia}</span>`;

        if(eventosDia.length){
            div.classList.add("tem-evento");
            div.onclick=()=>abrirModalEvento(eventosDia);
        }

        const hoje=new Date();
        if(
            hoje.getFullYear()==2026 &&
            hoje.getMonth()==mesAtual &&
            hoje.getDate()==dia
        ){
            div.classList.add("hoje");
        }

        grid.appendChild(div);
    }
}

function abrirModalEvento(lista){
    const modal=document.createElement("div");
    modal.className="modal-overlay";
    modal.innerHTML=`
        <div class="modal">
            <h2>Eventos do Dia</h2>
            ${lista.map(e=>`
                <div style="margin:15px 0;padding:10px;border-left:4px solid #0077ff;">
                    <h3>${e.titulo}</h3>
                    <p>${e.descricao}</p>
                </div>
            `).join("")}
            <button onclick="this.closest('.modal-overlay').remove()"
            style="margin-top:20px;padding:10px 20px;border:none;border-radius:10px;background:#0077ff;color:white;cursor:pointer;">
            Fechar
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function toggleMenu(){
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".overlay");

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

document.querySelectorAll(".sidebar a").forEach(link=>{
    link.addEventListener("click",()=>{
        if(window.innerWidth < 900){
            document.querySelector(".sidebar").classList.remove("active");
            document.querySelector(".overlay").classList.remove("active");
        }
    });
});





const modal = document.getElementById("aulaModal");

modal.addEventListener("click", function(e){
    if(e.target === modal){
        modal.classList.remove("active");
    }
});
