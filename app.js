const zones={operation:'操作与设备',forming:'定型与切片',packing:'外包装室',cold:'冷藏与通道',cleaning:'清洗间',changing:'更衣与洗手'};
const photos=[
{id:1,zone:'packing',title:'外包装室 · 室内视角',description:'室内可见不锈钢设备、工作台及敞开的冷柜，墙上设有质量主题标语。'},
{id:2,zone:'cold',title:'冷柜与输送设备',description:'白色卧式冷柜沿墙摆放，旁边可见蓝色输送带和竖向机架。'},
{id:3,zone:'operation',title:'操作间 · 入口视角',description:'透过玻璃门，可见操作间内部空间、金属周转托盘与设备。'},
{id:4,zone:'forming',title:'定型区 · 设备近景',description:'现场“定型区”标识下，可见双室翻盖设备及相邻机台。'},
{id:5,zone:'forming',title:'定型与切片 · 区域视角',description:'墙上可见“定型区”“切片区”标识，画面包含设备和工作台。'},
{id:6,zone:'operation',title:'操作间 · 设备与台面',description:'不锈钢机身、控制面板、蓝色输送结构和工作台面的现场细节。'},
{id:7,zone:'cold',title:'厂内通道与周转托盘',description:'通道两侧可见堆放的蓝色托盘、搬运车及门体，地面设黄色边线。'},
{id:8,zone:'packing',title:'外包装室 · 入口视角',description:'带有“外包装室”标识的入口，展示室内设备与工作台布置。'},
{id:9,zone:'operation',title:'滚筒设备 · 正面视角',description:'两台不锈钢滚筒式设备及其支架、连接管路和墙面控制箱。'},
{id:10,zone:'forming',title:'定型区 · 设备排列',description:'双室设备、相邻机台与框架设备沿墙排列，前方为工作台。'},
{id:11,zone:'cleaning',title:'清洗间 · 入口视角',description:'入口标有“清洗间”，室内可见不锈钢容器、器具与墙面管线。'},
{id:12,zone:'changing',title:'更衣区域 · 储物设施',description:'现场可见储物柜、鞋架及墙面管理制度，柜旁标有衣物存放处。'},
{id:13,zone:'changing',title:'洗手区域 · 设施细节',description:'洗手盆、皂液设施、干手设备及洗手步骤提示的近景。'},
{id:14,zone:'changing',title:'更衣与洗手 · 整体视角',description:'工作服挂放、洗手设施与连接通道的整体现场画面。'}
];
const imagePath=id=>`photo-${String(id).padStart(2,'0')}.jpg`;
let currentFilter='all',visiblePhotos=photos,selectedIndex=0,lastFocus;
const gallery=document.querySelector('#gallery-grid'),dialog=document.querySelector('#lightbox'),dialogImage=document.querySelector('#lightbox-image');
function renderGallery(filter='all'){
 currentFilter=filter;visiblePhotos=filter==='all'?photos:photos.filter(p=>p.zone===filter);
 gallery.innerHTML=visiblePhotos.map(p=>`<figure class="photo-card"><button class="photo-open" data-photo="${p.id}" aria-label="放大查看：${p.title}"><img src="${imagePath(p.id)}" alt="${p.description}" loading="lazy" decoding="async"><span class="photo-number">${String(p.id).padStart(2,'0')} / 14</span><span class="photo-expand" aria-hidden="true">↗</span></button><figcaption class="photo-caption"><div><h3>${p.title}</h3><p>点击查看原片</p></div><span>${zones[p.zone]}</span></figcaption></figure>`).join('');
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 document.querySelector('.gallery-count').textContent=`${visiblePhotos.length} 张照片${filter==='all'?'':' · '+zones[filter]}`;
}
function updateLightbox(){const p=visiblePhotos[selectedIndex];dialogImage.src=imagePath(p.id);dialogImage.alt=p.description;document.querySelector('#lightbox-count').textContent=`${String(selectedIndex+1).padStart(2,'0')} / ${String(visiblePhotos.length).padStart(2,'0')}`;document.querySelector('#lightbox-title').textContent=p.title;document.querySelector('#lightbox-category').textContent=zones[p.zone];document.querySelector('#lightbox-description').textContent=p.description;const single=visiblePhotos.length===1;document.querySelector('#prev-photo').disabled=single;document.querySelector('#next-photo').disabled=single;}
function openPhoto(id){if(!visiblePhotos.some(p=>p.id===id)){visiblePhotos=photos;}selectedIndex=visiblePhotos.findIndex(p=>p.id===id);if(selectedIndex<0)return;lastFocus=document.activeElement;updateLightbox();dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>renderGallery(b.dataset.filter)));
document.querySelectorAll('[data-zone]').forEach(b=>b.addEventListener('click',()=>{renderGallery(b.dataset.zone);document.querySelector('#gallery').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
gallery.addEventListener('click',e=>{const b=e.target.closest('[data-photo]');if(b)openPhoto(Number(b.dataset.photo));});
document.querySelector('#close-lightbox').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus({preventScroll:true});if(currentFilter!=='all')visiblePhotos=photos.filter(p=>p.zone===currentFilter);});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function nextPhoto(delta){selectedIndex=(selectedIndex+delta+visiblePhotos.length)%visiblePhotos.length;updateLightbox();}
document.querySelector('#prev-photo').onclick=()=>nextPhoto(-1);document.querySelector('#next-photo').onclick=()=>nextPhoto(1);
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();nextPhoto(-1);}if(e.key==='ArrowRight'){e.preventDefault();nextPhoto(1);}});
document.addEventListener('show-machine-photo',e=>openPhoto(e.detail));
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.header nav');menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'收起导航':'展开导航');};nav.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');});
document.querySelector('#copy-phone').onclick=async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('17551022297');status.textContent='已复制';}catch{status.textContent='请长按号码复制：17551022297';}};
renderGallery();

