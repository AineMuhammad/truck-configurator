import useConfiguratorStore from '../../store/useConfiguratorStore';
import './Loader.css';

export default function Loader() {
  const loadingProgress = useConfiguratorStore(state => state.loadingProgress);

  return (
    <>
      <div className="loader-blur" />
      <div className="loader-container">
        <div className="loader-content">
          <div className="loader-spinner-container">
            <div className="loader-spinner" />
          </div>
          <div className="loader-progress-container">
            <div 
              className="loader-progress-bar"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="loader-text">
            {loadingProgress ? `${Math.round(loadingProgress)}%` : 'Loading'}
          </p>
        </div>
      </div>
    </>
  );
}
