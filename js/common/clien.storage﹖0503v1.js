function STORAGE() {

	var saveUserId = '';

	if (typeof sessionUserId != 'undefined') {
		saveUserId = sessionUserId;
	}

	var url = BASE_URL+'/api/auth/memo/list';
	var _this = this;

	/**
	 * 페이지 로딩시 로컬 스토리지 메모관련 정보 확인 및 저장
	 */
	_this.storageSave = function() {
		var memoList = localStorage.getItem('MY_MEMO_LIST');
		var memo_view_yn = localStorage.getItem( 'MEMO_LIST_VIEW_YN');
		
		// 스토리지에 메모 관련 정보가 있는지 없는지 여부 확인
		if ( memoList == undefined || memoList == null || memoList == '' ) {
			$.ajax({
				url: url,
				type: 'GET',
				success: function(memoList) {
					localStorage.setItem( 'MY_MEMO_LIST', JSON.stringify(memoList) );
					localStorage.setItem( 'MY_MEMO_LIST_ID', saveUserId );
				},
				error: function(result) {
					util.log(result);
				}
			});
			
			if ( memo_view_yn == undefined || memo_view_yn == null || memo_view_yn == '' ) {
				localStorage.setItem( 'MEMO_LIST_VIEW_YN', true );
			}
		} else {
			var localStorage_userID = localStorage.getItem( 'MY_MEMO_LIST_ID');
			// 저장된 값이 로그인 유저와 일치하는지 여부 확인
			if( localStorage_userID != saveUserId ) {
				//저장된 값이 로그인 유저와 다를경우 제 업로드
				$.ajax({
					url: url,
					type: 'GET',
					success: function(memoList) {
						localStorage.setItem( 'MY_MEMO_LIST', JSON.stringify(memoList) );
						localStorage.setItem( 'MY_MEMO_LIST_ID', saveUserId );
					},
					error: function(result) {
						util.log(result);
					}
				});
			}
		}

		// 메모 LIST VIEW 표시여부 확인
		var memo_view_yn = localStorage.getItem( 'MEMO_LIST_VIEW_YN');
		
		if ( memo_view_yn == undefined || memo_view_yn == null || memo_view_yn == '' ) {
			localStorage.setItem( 'MEMO_LIST_VIEW_YN', true );
		} else {
			var localStorage_userID = localStorage.getItem('MY_MEMO_LIST_ID');
			
			// 저장된 값이 로그인 유저와 일치하는지 여부 확인
			if( localStorage_userID != saveUserId ) {
				localStorage.setItem( 'MEMO_LIST_VIEW_YN', true );
			}
		}
	};

	/**
	 * 로컬스토리지 메모 및 키워드 DB동기화
	 */
	_this.storageUpdate = function() {
		$.ajax({
			url: url,
			type: 'GET',
			async: false,
			dataType: 'json',
			success: function(memoList) {
				localStorage.setItem( 'MY_MEMO_LIST', JSON.stringify(memoList));
				localStorage.setItem( 'MY_MEMO_LIST_ID', saveUserId );
				
				$.ajax({
					url: API_HOST + "/mypage/keyword",
					type: 'GET',
					async: false,
					success: function(data) {
						var params = {
							keywordYn : data.keywordYn,
							blockKeyWord : data.blockKeyword,
							highlightKeyWord : data.highlightKeyword
						}
						localStorage.setItem('KEYWORD', JSON.stringify(params));
					},
					error: function(result) {
						util.log(result);
					}
				});
			},
			error: function(result) {
				util.log(result);
			}
		});
	};

	/**
	 * 로컬스토리지 메모 관련 업데이트
	 */
	_this.storageUpdatePopup = function(userId) {
		$.ajax({
			url: url,
			type: 'GET',
			async: false,
			dataType: 'json',
			success: function(memoList) {
				localStorage.setItem( 'MY_MEMO_LIST', JSON.stringify(memoList));
				localStorage.setItem( 'MY_MEMO_LIST_ID', userId );
			},
			error: function(result) {
				util.log(result);
			}
		});
	};

	/**
	 * 로컬스토리지 메모 설정
	 */
	_this.updateMemoViewSetting = function(){
		var memoView_yn = localStorage.getItem('MEMO_LIST_VIEW_YN');
		if(memoView_yn == "true"){
			localStorage.setItem('MEMO_LIST_VIEW_YN', false);
		} else {
			localStorage.setItem('MEMO_LIST_VIEW_YN', true);
		}
	}

	/**
	 * 로컬스토리지 개인메뉴 설정 쿠키에서 불러오기
	 */
	_this.storageGetBookmaker = function() {
		var cookieName = 'BOOKMAKER';
		cookieName = cookieName + '=';
		var cookieData = document.cookie;
		var start = cookieData.indexOf(cookieName);
		var cookieValue = '';
		if(start != -1){
			start += cookieName.length;
			var end = cookieData.indexOf(';', start);
			if(end == -1)end = cookieData.length;
			cookieValue = cookieData.substring(start, end);
			return JSON.parse(unescape(cookieValue));
		}
		return null;
	};

	/**
	 * 로컬스토리지 개인메뉴 설정 쿠키에 저장하기
	 */
	_this.storageUpdateBookmaker = function(data) {
		var exdays = 365;
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var cookieValue = escape(JSON.stringify(data)) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString() + "; domain="+COOKIE_DOMAIN+"; path=/;");
		document.cookie = "BOOKMAKER=" + cookieValue;
	};
	
	/**
	 * 내기기 쿠키 등록
	 */
	_this.saveMyDevice = function(data) {
		$.cookie('CL_DEVICE_'+data.userId, JSON.stringify(data), { expires: 1000, path: '/', domain: COOKIE_DOMAIN, secure: false });
	}
	
	/**
	 * 페이지 설정 쿠키 등록
	 */
	_this.saveMyPage = function(data) {
		$.cookie('PAGESETTING', JSON.stringify(data), { expires: 1000, path: '/', domain: COOKIE_DOMAIN, secure: false });
	}
	
	/**
	 * 로컬스토리지 키워즈 저장하기
	 */
	_this.storageUpdateKeyword = function(data) {
		var jsonInfo = JSON.stringify(data);
		localStorage.setItem('KEYWORD', jsonInfo);
	}
	
	/**
	 * 모바일 메뉴 고정 저장하기
	 */
	_this.updateMenuFixedSetting = function() {
		var menuFixed = localStorage.getItem('CLIEN_MEMU_FIXED');
		if(menuFixed == "false"){
			localStorage.setItem('CLIEN_MEMU_FIXED', true);
		} else {
			localStorage.setItem('CLIEN_MEMU_FIXED', false);
		}
		
	}

	/**
	 * Init
	 */
	_this.init = function() {
		//로그인 check
		if(IS_LOGIN){
			_this.storageSave();
		}
	}();
}

var storage = new STORAGE();