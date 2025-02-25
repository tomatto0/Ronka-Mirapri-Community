"use client";

import { useGetNews } from "../hooks/useNews";
import { useState, useEffect } from "react";
import Link from "next/link";

interface PostInform {
  _id: string;
  title: string;
  created_at: string;
  url: string;
}

export default function IntroducePage() {
  const { data, isLoading, isError } = useGetNews();
  const [newsData, set_newsData] = useState<PostInform[]>([]);

  useEffect(() => {
    set_newsData(data?.data);
  }, [data]);

  console.log({ newsData });

  // const postDate = formatDate(new Date(data.created_at));

  function formatDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const dd = String(date.getDate()).padStart(2, "0"); // 일
    return `${yyyy}.${mm}.${dd}`;
  }

  return (
    <>
      <div className="title-box">
        <img src="/img/titlelogo.svg" alt="logo icon" id="intro-logo" />
        <Link href="https://github.com/tomatto0/Ronka-Mirapri-Community">
          <img
            alt="GitHub Repo stars"
            src="https://img.shields.io/github/stars/tomatto0/Ronka-Mirapri-Community?style=social"
          />
        </Link>
      </div>

      <p className="intro-page-description">
        롱카의 룩북?은 롱카의 옷장에서 확장된 서브 프로젝트로, 기존의 룩템
        아카이빙을 넘어 모험가 여러분이 더욱 즐겁게 투영 생활을 즐길 수 있도록
        마련한 <strong>파판14 투영 커뮤니티 사이트</strong>입니다. 쉽고 간편하게
        투영기록을 공유하고 영감을 주고받으며, 나만의 개성을 마음껏
        표현해보세요!
      </p>

      <div className="page-introduce-wrap">
        <div className="page-introduce-gallery">
          <img
            src="/img/intro-background-gallery.svg"
            alt="sample-image-gallery"
            className="page-introduce-background"
          />
          <img
            src="/img/intro-background-gallery-s.svg"
            alt="sample-image-gallery"
            className="page-introduce-background-s"
          />
          <div className="intro-contents-background">
            <div className="intro-contents">
              <img
                src="/img/intro-gallery.png"
                alt="sample-image-gallery"
                className="gallery-sample1"
              />
              <img
                src="/img/intro-gallery2.png"
                alt="sample-image-gallery"
                className="gallery-sample2"
              />
              <img
                src="/img/intro-gallery-s.png"
                alt="sample-image-gallery"
                className="gallery-sample-s"
              />
              <p className="intro-page-description half-width">
                다양한 모험가들의 개성 넘치는 투영기록들을 감상하고, 필터
                기능으로 원하는 종족, 직업, 아이템에 맞는 코디만 쏙쏙 골라볼 수
                있어요.
              </p>
            </div>
          </div>
        </div>
        <div className="page-introduce-generator">
          <img
            src="/img/intro-background-generator.svg"
            alt="sample-image-gallery"
            className="page-introduce-background"
          />
          <img
            src="/img/intro-background-generator-s.svg"
            alt="sample-image-gallery"
            className="page-introduce-background-s"
          />
          <div className="intro-contents-background">
            <div className="intro-contents">
              <img
                src="/img/intro-generator.png"
                alt="intro-generator"
                className="generator-sample"
              />
              <img
                src="/img/intro-generator-s.png"
                alt="intro-generator"
                className="generator-sample-s"
              />

              <p className="intro-page-description">
                쉽고 간편한 코디 기록! 스크린샷과 함께 장착한 아이템을 하나의
                이미지로 저장할 수 있어요. 로그인하면 직접 스타일 노트를 작성해
                나만의 룩북을 안전하게 백업할 수도 있어요.
              </p>
            </div>
          </div>
        </div>
        <div className="page-introduce-mypage">
          <img
            src="/img/intro-background-mypage.svg"
            alt="sample-image-gallery"
            className="page-introduce-background"
          />
          <img
            src="/img/intro-background-mypage-s.svg"
            alt="sample-image-gallery"
            className="page-introduce-background-s"
          />
          <div className="intro-contents-background">
            <div className="intro-contents">
              <img
                src="/img/intro-mypage.png"
                alt="intro-mypage"
                className="mypage-sample"
              />
              <img
                src="/img/intro-mypage-s.png"
                alt="intro-mypage"
                className="mypage-sample-s"
              />
              <p className="intro-page-description">
                내가 올린 투영기록들과 ‘좋아요’한 코디를 한눈에 모아볼 수
                있어요. 회원정보 수정도 가능하니, 투영기록과 함께 프로필도
                업데이트해보세요!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="intro-member-block-wrap">
        <h2>멤버 소개</h2>
        <ul>
          <li>
            <div className="profile-img">
              <p className="member-number">01</p>
              <img
                src="/img/member-tomato.png"
                alt="member-image-tomato"
                className="member1"
              />
            </div>
            <h3>롱카의 토마토?</h3>
            <p>
              롱카의 옷장 관리자.
              <br /> 토마토도 좋아합니다.
            </p>
          </li>
          <li>
            <div className="profile-img">
              <p className="member-number">02</p>
              <img
                src="/img/member-sun.png"
                alt="member-image-sunglass"
                className="member2"
              />
            </div>
            <h3>롱카의 안경거치대?</h3>
            <p>
              ←의 친구. 사실 안경을
              <br />
              그렇게 좋아하지는 않습니다.
            </p>
          </li>
          <li>
            <div className="profile-img">
              <p className="member-number">03</p>
              <img
                src="/img/member-flour.png"
                alt="member-image-flour"
                className="member3"
              />
            </div>
            <h3>롱카의 전분?</h3>
            <p>
              ←←와 ←의 친구
              <br /> 구경을 했습니다.
            </p>
          </li>
        </ul>
      </div>

      <div className="intro-news-block-wrap">
        <h2>롱카의 룩북 새소식</h2>

        <ul>
          {newsData?.map(data => (
            <li key={data._id}>
              <Link href={data.url}>
                <div className="news-list">
                  <p>{data.title}</p>
                  <p>{formatDate(new Date(data.created_at))}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
