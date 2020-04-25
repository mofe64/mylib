const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, message) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 3000);
};

const login = async (username, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/user/login',
      data: {
        username,
        password,
      },
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      console.log('fail');
    }
    //console.log(res);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/user/logout',
    });

    if ((res.data.status = 'success')) {
      location.reload(true);
    }
  } catch (error) {
    console.log(error.response);
    showAlert('error', 'Error logging out, try again');
  }
};

const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    //console.log(username);
    //console.log(password);
    login(username, password);
  });
}

const logOutBtn = document.querySelector('.logOutBtn');

if (logOutBtn) logOutBtn.addEventListener('click', logout);
