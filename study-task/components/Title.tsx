type TitleProps = {
  title: string;
};

function Title({ title }: TitleProps) {
  return (
    <>
      <h1 className="font-extrabold text-[36px]">{title}</h1>
    </>
  );
}

export default Title;
