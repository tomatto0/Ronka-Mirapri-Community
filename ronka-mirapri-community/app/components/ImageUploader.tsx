export default function ItemUploader({
  set_image_src,
}: {
  set_image_src: (src: string) => void;
}) {
  const image_validate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력된 파일의 확장자 추출
    const ext = e.target.value
      .substring(e.target.value.lastIndexOf(".") + 1, e.target.value.length)
      .toLowerCase();

    if (
      ["bmp", "png", "jpeg", "jpg"].includes(ext) &&
      e.target.files !== null
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        set_image_src(reader.result as string);
      };
    } else {
      console.log("유효하지 않은 이미지");
      e.target.value = "";
    }
  };

  return (
    <input
      type="file"
      accept="image/bmp, image/png, image/jpeg"
      onChange={image_validate}
    />
  );
}
