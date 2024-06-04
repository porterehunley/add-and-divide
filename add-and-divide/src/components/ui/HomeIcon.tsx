export default function HomeIcon({
  className, onClick}: {className: string, onClick: React.MouseEventHandler}) {
  return (
    <svg className={className} onClick={onClick} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9.8L12 2L21 9.8V21H15V14H9V21H3V9.8Z" stroke="#6b5b95" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}