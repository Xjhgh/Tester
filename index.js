async function sendToServer(formData) {
            try {
                const response = await fetch('https://send.moeinjiji.workers.dev/', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.text();
                return result.includes("Success");
            } catch (error) {
                console.error("Error sending to server:", error);
                return false;
            }
        }

        document.getElementById('orderForm').onsubmit = async function(e) {  
            e.preventDefault();  
            const btn = this.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "در حال ارسال...";
            btn.disabled = true;

            const formData = new FormData(this);  
            
            const success = await sendToServer(formData);
            
            if(success) {
                saveToLocal(Object.fromEntries(formData)); 
                showSuccess();
                this.reset();
            } else {
                alert("متأسفانه خطایی در ارسال رخ داد. لطفاً دوباره تلاش کنید.");
            }
            
            btn.innerText = originalText;
            btn.disabled = false;
        };  

        document.getElementById('contactForm').onsubmit = async function(e) {  
            e.preventDefault();  
            const btn = this.querySelector('button');
            btn.innerText = "در حال ارسال...";
            btn.disabled = true;

            const formData = new FormData(this);  
            const success = await sendToServer(formData);

            if(success) {
                showSuccess();  
                this.reset();
            } else {
                alert("خطا در ارسال پیام. لطفاً بعداً امتحان کنید.");
            }
            btn.innerText = "ارسال پیام";
            btn.disabled = false;
        };  

        let lastP = 0;  
        const nav = document.getElementById('navbar');  
        window.addEventListener('scroll', () => {  
            let nowP = window.pageYOffset;  
            if (nowP > 50) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');  
            if (nowP > lastP && nowP > 100) nav.classList.add('nav-hidden'); else nav.classList.remove('nav-hidden');  
            lastP = nowP;  
        });  
        
        function toggleMenu() { document.body.classList.toggle('menu-open'); }  
        function toggleTheme() {  
            const isDark = document.body.classList.toggle('dark');  
            document.getElementById('themeIcon').innerText = isDark ? '🌙' : '☀️';  
        }  
        
        function go(id) {  
            document.body.classList.remove('menu-open');  
            document.getElementById('giftWrapper').style.display = (id === 'home') ? 'block' : 'none';  
            if(id === 'my-projects') renderMyProjects();  
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));  
            document.getElementById(id).classList.add('active');  
            window.scrollTo({ top: 0, behavior: 'smooth' });  
        }  
        
        function saveToLocal(data) {  
            let orders = JSON.parse(localStorage.getItem('moein_orders') || '[]');  
            data.date = new Date().toLocaleDateString('fa-IR');  
            data.id = Date.now();  
            orders.push(data);  
            localStorage.setItem('moein_orders', JSON.stringify(orders));  
        }  
        
        function renderMyProjects() {  
            const list = document.getElementById('projects-list');  
            const orders = JSON.parse(localStorage.getItem('moein_orders') || '[]');  
            if(orders.length === 0) { list.innerHTML = `<p style="text-align:center; opacity:0.5; padding: 50px;">هنوز سفارشی ثبت نکردی!</p>`; return; }  
            list.innerHTML = orders.reverse().map(order => `  
                <div class="project-card">  
                    <div style="display:flex; justify-content:space-between; align-items:center;">  
                        <h3 style="color:var(--accent); font-weight:900;">${order.نوع_سایت}</h3>  
                        <span style="font-size:0.85rem; opacity:0.6;">${order.date}</span>  
                    </div>  
                    <button class="view-btn" onclick="toggleDetails(${order.id})">مشاهده کامل جزئیات</button>  
                    <div id="details-${order.id}" style="display:none">  
                        <div style="margin-top:10px; border-top:1px solid var(--border); padding-top:10px;">  
                            <b>بودجه:</b> ${order.بودجه}<br>  
                            <b>امکانات:</b> ${order.امکانات || '---'}<br>  
                            <b>توضیحات:</b> ${order.توضیحات || '---'}  
                        </div>  
                    </div>  
                </div>  
            `).join('');  
        }  
        
        function toggleDetails(id) {  
            const el = document.getElementById('details-' + id);  
            el.style.display = (el.style.display === 'block') ? 'none' : 'block';  
        }  
        
        function showSuccess() {  
            document.getElementById('success-screen').style.display = 'flex';  
            setTimeout(() => { document.getElementById('success-screen').style.display = 'none'; go('home'); }, 3000);  
        }  
        
        window.addEventListener('load', () => {   
            if(document.getElementById('home').classList.contains('active')) {  
                setTimeout(() => { document.getElementById('giftWrapper').style.display = 'block'; }, 1000);   
            }  
        });  
        
        let giftIdx = 0;  
        const gSlides = document.querySelectorAll('.gift-slide');  
        function openGift() { document.getElementById('giftModal').classList.add('show'); }  
        function closeGift(e) { if(!e || e.target.id === 'giftModal') document.getElementById('giftModal').classList.remove('show'); }  
        function moveGift(n) {  
            gSlides[giftIdx].classList.remove('active');  
            giftIdx = (giftIdx + n + gSlides.length) % gSlides.length;  
            gSlides[giftIdx].classList.add('active');  
        }  

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('Service Worker Registered!'))
                    .catch(err => console.error('Registration Failed!'));
            });
        }
