function App() {
	var _this = this;

	// ENV
	_this.env = {
		isBoardGroupPage: ($('#isGroup').val() == "true"), // 그룹 목록여부
		groupCd: $('#groupCd').val(), // 그룹 코드
		boardCd: $('#boardCd').val(), // 게시판 코드
		boardSn: 0,
		category: $('#category').val(), // 카테고리
		po: $('#po').val(), // 페이지 번호
		od: $('#od').val(), // 게시글 정렬 기준
		sk: $('#sk').val(), // 검색 조건
		sv: $('#sv').val(), // 검색어
		cardView: $('#confListType').val(), // 카드뷰 인스턴스
		hongboUseYn: ($('#hongboUseYn').val() == "true"),
		SearchIsVaild : $('#searchIsVaild').val()
	};

	// 검색어 강조
	_this.mark = function() {
		$(".list_item").mark(_this.env.sv);
	}

	// Init
	_this.init = function() {
		// 직접홍보 리스트 1개 호출 | board_list_config에서 사용유무 확인
		if (typeof _this.env.hongboUseYn == 'boolean' && _this.env.hongboUseYn){
			hongbo.hongboList();
		}

		// 리스트 Block && 리스트 메모
		ui.initBlockArticle();

		// 리스트 공감 목록 색상 UI
		ui.initSymphathy();

		// 리스트 즐겨찾기 별 UI
		ui.initBookmakerStarDisplay();

		// 단축키 설정
		ui.initShortCut();

		// 검색 일경우 mark JS 실행
		if(_this.env.SearchIsVaild) {
			_this.mark();
		};
		
		// 리포트
		if(_this.env.boardCd == 'annonce'){
			report.getInfo();
		}
	}();
}

var app = new App();