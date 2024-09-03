function Recommend() {
	var _this = this;
	
	// ENV -->
	_this.env = {};

	// Ajax RecommendList Get
	_this.getRecommendList = function() {
		$.ajax({
			url: BASE_URL + "/recommend/list",
			type: 'GET',
			dataType: 'html',
			success: function(result) {
				// 게시판 리스트 생성
				$('#listDiv').html(result);
				// 직접홍보 리스트 호출
				hongbo.hongboList();
				// 현재 게시물 표시
				$('*[data-role=list-row]').each(function() {
					var row = $(this);
					if(row.data('board-sn') == $('#boardSn').val()){
						row.addClass('active');
					}
				});
				// 본문 이전 다음 버튼 제거
				$('.action_box').addClass('non-menu');
				ui.initBlockArticle();
				// 목록에서 공감 Class 추가
				ui.initSymphathy();
				// 모바일 네이버 광고 호출 ( PC는 빈 함수 )
				app.naverAdLoad();

			},
			error: function(result) {
				console.log(result);
			}
		});
	}
};

var recommend = new Recommend();