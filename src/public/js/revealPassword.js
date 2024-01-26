const bttn = document.getElementById('reveal');
const pass = document.getElementById('password');
const eye = document.getElementById('eye');

bttn.onclick = () => {
	if (pass.type == 'password') {
		pass.type = 'text'
		eye.classList.remove('fa-eye');
		eye.classList.add('fa-eye-slash');
	} else {
		pass.type = 'password';
		eye.classList.remove('fa-eye-slash');
		eye.classList.add('fa-eye');
	};
};
