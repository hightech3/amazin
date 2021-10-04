import Header from 'src/layouts/Header';
import LoadingOrError from '../components/LoadingOrError';
import Button from '../components/Button';

type PropType = {
  onSubmit: FnType;
  header?: string | undefined;
  statusOf?: StatusType;
  children?: Children;
  btn?: string | undefined;
  more?: Children;
  props?: RestProps;
};

export default function Form({ header, statusOf, children, btn, more, ...props }: PropType) {
  return (
    <form className="form" {...props}>
      {header && <Header label={header} />}
      {statusOf && <LoadingOrError statusOf={statusOf} />}
      {children}
      {btn && <Button primary fill type="submit" label={btn} />}
      {more}
    </form>
  );
}
