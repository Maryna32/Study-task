type TitleProps = {
  title: string;
};

function Title({ title }: TitleProps) {
  return (
    <>
      <h1 className="ml-[10px] font-extrabold text-[36px]">{title}</h1>
    </>
  );
}

export default Title;
