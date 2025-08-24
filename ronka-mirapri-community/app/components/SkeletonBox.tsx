import "../css/Skeleton.css";

export default function SkeletonBox() {
  return (
    <>
      <div className='skeleton-box'>
        <div className='skeleton'></div>
        <div className='skeleton'></div>
        <div className='skeleton'></div>
        <div className='skeleton'></div>
      </div>
    </>
  );
}
