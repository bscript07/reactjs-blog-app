import LoadingGif from '../assets/loading.gif';

const Spinner = () => {
  return (
    <div className='spinner'>
      <div className="spinner__image">
        <img src={LoadingGif} alt="loading-gif" />
      </div>
    </div>
  )
}

export default Spinner
