import Link from "next/link";

export default function RulePage() {
  return (
    <>
      <div className="rule-block-wrap">
        <h1 className="rule-page-title">이용가이드</h1>
        <p className="rule-page-description">
          롱카의 룩북을 이용해 주셔서 감사합니다.
          <br /> 사이트 이용 시 아래의 운영 정책을 반드시 숙지하시고, 원활한
          커뮤니티 운영을 위해 협조 부탁드립니다.
        </p>
      </div>

      <div className="rule-block-wrap">
        <h2>이미지 업로드 가이드</h2>
        <p className="rule-page-description-sub">
          룩북의 일관된 분위기를 유지하고, 모험가분들이 더욱 몰입감 있는 코디를
          즐길 수 있도록 협조 부탁드립니다!
        </p>

        <div className="rule-list-wrap">
          <h3>이미지 규격 및 촬영 방식</h3>
          <ul>
            <li>
              업로드 이미지는 전신의 아이템이 잘 보이는 정면 사진을 권장합니다.
            </li>
            <li>
              소품 및 꼬마친구, 탈 것 등으로 전신의 아이템이 가려지지 않은
              사진을 사용해주세요.
            </li>
            <li>
              외부 카메라가 아닌, 게임 내에서 촬영 기능을 사용한 스크린샷만
              업로드 가능합니다.
            </li>
            <li>
              <strong>
                파이널판타지14에 구현되지 않은 아이템이 표시되거나 외형이 변경된
                이미지(모드 사용)
              </strong>
              는 별도의 통보 없이 삭제될 수 있습니다.
            </li>
          </ul>

          <img
            src="/img/image-guide.png"
            alt="guide-image"
            className="guide-image"
          />

          <img
            src="/img/image-guide-s.png"
            alt="guide-image"
            className="guide-image-s"
          />

          <h3>이미지 보정 및 수정</h3>
          <ul>
            <li>
              색감 보정을 위해 외부 프로그램을 사용하거나 보정하는 것은
              허용되지만, 감상에 지장을 주지 않는 선에서만 가능합니다.
            </li>
            <li>
              단,{" "}
              <strong>
                원색을 알아볼 수 없을 정도의 과도한 보정이 적용된 이미지
              </strong>
              는 별도의 통보 없이 삭제될 수 있습니다.
            </li>
          </ul>

          <h3>배경 이미지 기준</h3>
          <ul>
            <li>
              반드시 <strong>파이널판타지14 게임 내 배경</strong>을 사용해야
              합니다.
            </li>
            <li>
              게임 내 배경이 아닌 이미지(예: 외부 CG, 크로마키 배경 등)를
              사용하여 게임 내 장면과 혼동을 줄 수 있는 경우, 별도의 통보 없이
              삭제될 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
      <div className="rule-block-wrap">
        <h2>글 작성 가이드</h2>
        <ul>
          <li>예시 이미지에 맞는 적절한 착용가능 성별, 종족을 입력해주세요.</li>
          <li>해당 장비를 착용할 수 있는 직업을 올바르게 선택해주세요.</li>
          <li>
            스크린샷에 표시된 장비를 최대한 상세히 입력하여 투영 세트 참고가
            용이하도록 해주세요.
          </li>
        </ul>
      </div>

      <hr className="about-divider" />

      <div className="rule-block-wrap">
        <h2>제재 기준</h2>
        <p className="rule-page-description-sub">
          📌 다음과 같은 경우 경고 1회가 부여되며, 해당 내용이 수정 또는
          삭제됩니다.
        </p>

        <div className="rule-list-wrap">
          <h3>부적절한 닉네임 및 SNS 정보 등록</h3>
          <ul>
            <li>
              닉네임, SNS에 부적절한 단어 포함시 경고 1회 후 관리자에 의해 임의
              수정 처리
            </li>
          </ul>

          <h3>게시글 제목, 내용, 태그에 부적절한 단어 포함</h3>
          <ul>
            <li>
              게시물 중{" "}
              <Link href="https://www.ff14.co.kr/support/policy">
                파이널판타지14 운영정책
              </Link>{" "}
              제7.4항 에 해당하는 ‘홈페이지 제재 항목’ 대상의 경우 작성자에게
              사전통지 없이 해당 게시물을 삭제할 수 있으며, 이를 작성한 계정은
              경고 1회 후 게시글 삭제
            </li>
          </ul>

          <h3>부적절한 이미지 업로드</h3>
          <ul>
            <li>
              파이널판타지14 외의 이미지(타 게임, 실사, 일러스트 등)를 포함한
              경우
            </li>
            <li>
              캐릭터 전신이 명확하게 보이지 않는 이미지(너무 가까운 클로즈업,
              과도한 이펙트, UI 포함 등)
            </li>
            <li>
              과도하게 가공되거나 왜곡된 이미지(극단적인 보정, 게임 내 구현되지
              않은 모드 사용 이미지 등)
            </li>
            <li>위 경우에 해당 될 경우 경고 1회 후 게시글 삭제</li>
          </ul>

          <h3>고의적인 잘못된 정보 기입</h3>
          <ul>
            <li>
              게시글 작성시 의도적으로 잘못된 아이템, 종족, 직업설정을
              반복적으로 입력하여 다른 유저에게 혼란을 줄 경우 경고 1회 부여
            </li>
          </ul>
        </div>
      </div>

      <div className="rule-block-wrap">
        <h2>누적 제재 및 계정 조치</h2>
        <p className="rule-page-description-sub">
          3회 누적시 계정 삭제 및 재가입 불가 처리
        </p>
      </div>

      <hr className="about-divider" />

      <div className="rule-block-wrap">
        <h2>운영 정책</h2>

        <div className="rule-list-wrap">
          <h3>투영기록 생성기 이용 관련 책임안내</h3>
          <ul>
            <li>
              투영기록 생성기 사용 및 게시글 작성 시, 본 운영 정책을 숙지하고
              동의한 것으로 간주됩니다.
            </li>
            <li>
              본 이미지 생성기를 통해 생성된 이미지와 관련된 모든 활동으로 인해
              발생하는 불미스러운 사건에 대해 롱카의 옷장?측은 이에 대해 책임을
              지지 않습니다.
            </li>
          </ul>

          <h3>저작권 및 무단 복제 금지</h3>
          <ul>
            <li>
              게시글 작성자가 아닌 제3자가 본 사이트에 게시된 이미지를 무단으로
              복제, 배포, 2차 가공하는 행위는 금지됩니다.
            </li>
          </ul>

          <h3>운영 정책 준수</h3>
          <ul>
            <li>
              본 사이트의 이미지 및 게시물은{" "}
              <Link href="https://www.ff14.co.kr/support/policy">
                파이널판타지14 한국서버 홈페이지 운영정책
              </Link>
              을 따릅니다. 해당 정책을 위반하는 게시물은 별도의 안내 없이 수정
              또는 삭제될 수 있습니다.
            </li>
            <li>
              운영정책에 명확히 명시되지 않은 사항이라도, 건전한 온라인 커뮤니티
              문화를 유지하기 위해 관리자가 필요하다고 판단하는 경우 적절한
              조치(수정, 삭제 등)가 이루어질 수 있습니다.
            </li>
          </ul>

          <h3>서비스의 일시 중단</h3>
          <ul>
            <li>
              롱카의 룩북은 정기정검 또는 서비스의 질을 향상시키기 위한 목적으로
              홈페이지 서비스를 일시 중단할 수 있습니다. 이 경우 회사는 사전에
              그 사유 및 중단 기간을 반드시 회원에게 통지합니다.
            </li>
            <li>
              단, 천재지변, 전기통신제공업자 등 제삼자의 귀책사유를 근거로 한
              경우 등과 같은 통제할 수 없는 명백한 불가항력적인 사유로
              중단되었을 경우는 예외로 합니다. 이로 인해 발생하는{" "}
              <strong>어떠한 손해에 대해서도 책임을 지지 않습니다.</strong>
            </li>
            <li>
              또한, 관리자는 게시된 이미지 및 게시물 데이터를 별도로 저장할
              의무가 없으므로,{" "}
              <strong>
                사용자가 필요한 데이터는 직접 백업해 주시기 바랍니다.
              </strong>
            </li>
          </ul>
        </div>
      </div>

      <div className="rule-block-wrap">
        <p className="rule-page-description-sub">
          <strong>
            - 운영 정책은 필요 시 변경될 수 있으며, 변경된 내용은 별도의 공지를
            통해 안내됩니다.
          </strong>
        </p>
        <p className="rule-page-description-sub">
          - 이용규칙 혹은 사이트 이용에 관한 문의사항은{" "}
          <Link href="https://open.kakao.com/me/ronkacloset">오픈채팅</Link>
          으로 문의하여 주시기 바랍니다.
        </p>
        <p className="rule-page-description-sub">
          더 많은 모험가 분들이 편하고 즐거운 투영생활을 할 수 있도록 최선의
          노력을 다하겠습니다. 감사합니다.
        </p>
      </div>
    </>
  );
}
