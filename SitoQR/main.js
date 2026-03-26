const navbar = document.querySelector('nav');
document.addEventListener('scroll', function (e) {
    navbar.classList.toggle('after-scroll', window.scrollY > 0);
});


function initLoadMoreButton(button, ajax_url, action, limit, callback) {
    button.addEventListener('click', async (event) => {
        let page = Number(button.dataset.page);
        if (isNaN(page)) {
            page = 2;
        }
        const categoryId = button.dataset.categoryId ?? null;
        const params = new URLSearchParams();
        let disableButton = false;
        params.append('action', action);
        params.append('page', page);
        params.append('limit', limit);
        if (categoryId) {
            params.append('category_id', categoryId);
        }
        try {
            button.disabled = true;
            const response = await fetch(`${ajax_url}?${params.toString()}`);
            const jsonResponse = await response.json();
            if (!response.ok || !jsonResponse.success) {
                throw jsonResponse.message;
            }
            if (jsonResponse.data.length == 0) {
                button.setAttribute('disabled', true);
                disableButton = true;
            }
            button.dataset.page = page + 1;
            callback(jsonResponse.data);
        } catch(e) {
            Swal.fire('Attenzione', e, 'error');
        } finally {
            if (!disableButton)
                button.removeAttribute('disabled');
        }

    });
}


//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (!mybutton) return;
  if (
    document.body.scrollTop > 20 
    || document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton?.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}