export default function IntroducePage() {
  return (
    <>
      <img alt="logo icon" id="intro-logo" />
      <p>
        롱카의 룩북?은 롱카의 옷장에서 확장된 서브 프로젝트로, 기존의 룩템
        아카이빙을 넘어 모험가 여러분이 더욱 즐겁게 투영 생활을 즐길 수 있도록
        마련한 파판14 투영 커뮤니티 사이트입니다. 쉽고 간편하게 투영기록을
        공유하고 영감을 주고받으며, 나만의 개성을 마음껏 표현해보세요!
      </p>

      <div className="page-introduce-wrap">
        <div className="page-introduce-block">
          <img
            alt="intro-gallery"
            className="page-introduce-background-gallery"
          />
          <img alt="sample-image-gallery" className="gallery-sample1" />
          <img alt="sample-image-gallery" className="gallery-sample2" />
          <p>
            다양한 모험가들의 개성 넘치는 투영기록들을 감상하고, 필터 기능으로
            원하는 종족, 직업, 아이템에 맞는 코디만 쏙쏙 골라볼 수 있어요.
          </p>
        </div>
        <div className="page-introduce-block">
          <img
            alt="intro-generator"
            className="page-introduce-background-generator"
          />
          <img alt="sample-image-generator" className="generator-sample1" />
          <p>
            쉽고 간편한 코디 기록! 스크린샷과 함께 장착한 아이템을 하나의
            이미지로 저장할 수 있어요. 로그인하면 직접 스타일 노트를 작성해
            나만의 룩북을 안전하게 백업할 수도 있어요.
          </p>
        </div>
        <div className="page-introduce-block">
          <img
            alt="intro-mypage"
            className="page-introduce-background-mypage"
          />
          <img alt="sample-image-mypage" className="mypage-sample1" />
          <p>
            내가 올린 투영기록들과 ‘좋아요’한 코디를 한눈에 모아볼 수 있어요.
            회원정보 수정도 가능하니, 투영기록과 함께 프로필도 업데이트해보세요!
          </p>
        </div>
      </div>
      <h2>멤버소개</h2>
      <ul>
        <li>
          <p>01</p>
          <p>롱카의 토마토?</p>
          <img alt="member-image-tomato" className="member1" />
          <p>
            롱카의 옷장 관리자.
            <br /> 토마토도 좋아합니다.
          </p>
        </li>
        <li>
          <p>02</p>
          <img alt="member-image-sunglass" className="member2" />
          <p>롱카의 안경거치대?</p>
          <p>
            ←의 친구. 사실 안경을
            <br />
            그렇게 좋아하지는 않습니다.
          </p>
        </li>
        <li>
          <p>03</p>
          <img alt="member-image-flour" className="member3" />
          <p>롱카의 전분?</p>
          <p>
            ←←와 ←의 친구
            <br /> 구경을 했습니다.
          </p>
        </li>
      </ul>
      <h2>롱카의 룩북 새소식</h2>

      <ul></ul>
    </>
  );
}
