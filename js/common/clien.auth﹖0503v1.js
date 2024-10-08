function Auth() {
	var _this = this;

	// ENV
	_this.env = {};
	_this.env.form = $('#loginForm');
	_this.env.iptUserId = _this.env.form.find('*[name=userId]');
	_this.env.iptUserPassWord = _this.env.form.find('*[name=userPassword]');
	_this.env.iptTotpCode = $('#totpcode');

	/**
	 * 로그인 밸리데이션
	 */
	_this.loginValidate = function() {
		var isValid = true;
		if (_this.env.iptUserId.val().trim() == '') {
			alert('아이디를 입력하세요.');
			_this.env.iptUserId.focus();
			isValid = false;
			return isValid;
		}
		if (_this.env.iptUserPassWord.val().trim() == '') {
			alert('비밀번호를 입력하세요.');
			_this.env.iptUserPassWord.focus();
			isValid = false;
			return isValid;
		}
		return isValid;
	};

	/**
	 * 로그인
	 */
	_this.login = function() {
		var isValid = _this.loginValidate();
		
		var clienDv = $.cookie('CL_DEVICE_'+_this.env.iptUserId.val().trim());
		
		if(clienDv != undefined) {
			var cookieValue = JSON.parse(clienDv);
			$('#deviceId').val(cookieValue.deviceId);
		}
		
		if (isValid) {
			_this.googleOtp();
		}
	};
	
	_this.googleOtp = function() {
		var isValid = true;
		
		$.ajax({
			url: API_HOST+'/auth/google/otp',
			type: 'GET',
			async: false,
			data: {
				userId : _this.env.iptUserId.val().trim()
			},
			success: function(result) {
				if(result) {
					$('#otp').addClass('next');
					setTimeout(function(){
						_this.env.iptTotpCode.focus();
					}, 300);
				} else {
					auth.loginConfirm();
				}
			},
			error: function(result) {
				console.log("Google Otp Exception");
			}
		});
	}
	
	_this.loginConfirm = function() {
		_this.env.form.attr({
			method: 'POST',
			action: BASE_URL + '/login'
		});
		_this.env.form.submit();
	}
	
	_this.otpLoginConfirm = function() {
		
		var totpCode = _this.env.iptTotpCode.val().replace(/\s/gi, "");
		_this.env.iptTotpCode.val(totpCode)
		
		if(totpCode == '') {
			alert('코드를 입력해 주세요.');
			_this.env.iptTotpCode.focus();
			return false;
		}
		
		_this.env.form.attr({
			method: 'POST',
			action: BASE_URL + '/login'
		});
		_this.env.form.submit();
	}

	/**
	 * 이벤트 바인드
	 */
	_this.eventBind = function() {
		_this.env.iptUserId.on('keyup', function(e) {
			if (e.keyCode == '13') {
				_this.login();
			}
		});
		_this.env.iptUserPassWord.on('keyup', function(e) {
			if (e.keyCode == '13') {
				_this.login();
			}
		});
		_this.env.iptTotpCode.on('keyup', function(e) {
			if (e.keyCode == '13') {
				_this.otpLoginConfirm();
			}
		});
	};

	/**
	 * 비밀번호 유효성 및 위험여부 체크
	 */
	_this.pwCheckPossible = function(passWord) {
		var checkReturn = {};
		var isValid = false;
		var risk = ""; // VNSafety: 매우 위험, NSafety: 위험, Safety: 안전, VSafety: 매우 안전
		var num = passWord.search(/[0-9]/g);
		var eng = passWord.search(/[A-Z]/ig);
		var spe = passWord.search(/[`~!@@#$%^&*|\\\'\";:\/?]/gi);

		if( passWord.search(/\s/) != -1 ) {
			alert("비밀번호는 공백을 사용할 수 없습니다.");
			isValid = false;
		} else {
			if( passWord.length == 4 ) {
				risk = "VNsafety";
			} else if ( passWord.length >= 5 && passWord.length <= 8 ) {
				if( (num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0) ){
					risk = "Nsafety";
				} else {
					risk = "Safety";
				}
			} else if ( passWord.length > 8 ) {
				if( (num < 0 || eng < 0 || spe < 0) ){
					risk = "Safety";
				} else {
					risk = "VSafety";
				}
			}
			isValid = true;
		}

		checkReturn.isValid = isValid;
		checkReturn.risk = risk;
		return checkReturn;
	};

	/**
	 * 비밀번호 자리수 체크
	 */
	_this.passwordLengthCheck = function(password) {
		var isValid = false;

		if( password == '' ) {
			isValid = false;
		} else if ( Number(password.length) < 4) {
			alert("최소 4자 이상 입력하세요.");
			isValid = false;
		} else {
			isValid = true;
		}
		return isValid;
	};

	/**
	 * 이메일 유효성 검사
	 */
	_this.emailRegularExpression = function(email) {
		var isValid = false;
		var regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;

		if ( email.match(regExp) ) {
			isValid = true;
		} else {
			isValid = false;
		}
		return isValid;
	};

	/**
	 * 숫자 유효성 검사
	 */
	_this.numberRegularExpression = function(number) {
		var isVaild = false;
		var regNumber = /^[0-9]*$/;
		if(regNumber.test(number)) {
			isVaild = true;
		} else {
			isVaild = false;
		}
		return isVaild;
	};

	_this.ssnRegularExpression = function(bizID) {
		var isVaild = false;
		if(bizID.length == 10){
			// bizID는 숫자만 10자리로 해서 문자열로 넘긴다.
			var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
			var tmpBizID, i, chkSum=0, c2, remander;
				bizID = bizID.replace(/-/gi,'');

			for (i=0; i<=7; i++) chkSum += checkID[i] * bizID.charAt(i);
			c2 = "0" + (checkID[8] * bizID.charAt(8));
			c2 = c2.substring(c2.length - 2, c2.length);
			chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
			remander = (10 - (chkSum % 10)) % 10 ;
			 
			if (Math.floor(bizID.charAt(9)) == remander){
				isVaild = true;
			} else {
				isVaild = false;
			}
		}
		return isVaild;
	};

	/**
	 * Init
	 */
	_this.init = function() {
		_this.eventBind();
	}();
}

var auth = new Auth();