function Dashboard() {
	var _this = this;
	
	var boardCd = $('#boardCd').val();

	// 대쉬보드 접기 or 열기 기능
	_this.dashboard = function() {
		$('#dashboard').toggle();

		if($('#dashboard').css('display') == 'none') {
			localStorage.setItem( "DASHBOARD_NAME_"+ boardCd, "none" );
		} else {
			localStorage.setItem( "DASHBOARD_NAME_"+ boardCd, "block" );
		}
		_this.textSetting();
	}

	// 로컬스토리지에 대시보드 관련 정보 불러오기
	_this.settingDashboard = function() {
		var dashboardSetting = localStorage.getItem("DASHBOARD_NAME_"+boardCd);
		if ( dashboardSetting == undefined || dashboardSetting == null || dashboardSetting == '' ) {
			$('#dashboard').show();
		} else {
			$('#dashboard').css('display', dashboardSetting);
		}
		_this.textSetting();
	}

	// 대쉬보드 접기 or 열기 텍스트 셋팅
	_this.textSetting = function() {
		if($('#dashboard').css('display') == 'none') {
			$('#dashboardText').text('열기');
			$('#dashboardClass').removeClass('fa-caret-up');
			$('#dashboardClass').addClass('fa-caret-down');
		} else {
			$('#dashboardText').text('접기');
			$('#dashboardClass').removeClass('fa-caret-down');
			$('#dashboardClass').addClass('fa-caret-up');
		}
	}
	
	/**
	 * Init
	 */
	_this.init = function() {
		// 대시보드가 있는 게시판만 설정 , coin은 coinJs에서 호출
		if(boardCd == 'cm_bike' || boardCd == 'cm_golf' || boardCd == 'cm_lol' || boardCd == 'cm_surfing' || boardCd == 'cm_soccer' || boardCd == 'jirum' || boardCd == 'cm_bts'){
			_this.settingDashboard();
		}
	}();

};

var dashboard = new Dashboard();