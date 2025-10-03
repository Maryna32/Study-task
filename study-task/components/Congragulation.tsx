type NameProps = {
  name: string;
};

function Congragulation({ name }: NameProps): JSX.Element {
  return <div className=" text-lg font-semibold">Привіт, {name}!</div>;
}

export default Congragulation;
