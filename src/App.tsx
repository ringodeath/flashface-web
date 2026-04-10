import TitleBar from './components/TitleBar'
import CategorySelector from './components/CategorySelector'
import VariantStrip from './components/VariantStrip'
import FaceCanvas from './components/FaceCanvas'
import FeaturePreview from './components/FeaturePreview'
import ItemScaler from './components/ItemScaler'
import FeatureOptions from './components/FeatureOptions'
import FilterPanel from './components/FilterPanel'
import ActionButtons from './components/ActionButtons'
import ConfirmDialog from './components/ConfirmDialog'
import WelcomeDialog from './components/WelcomeDialog'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function App() {
  useKeyboardShortcuts();

  return (
    <div className="desktop">
      <div className="window main-window">
        <TitleBar />
        <div className="window-body">
          <div className="app-layout">
            <div className="left-panel">
              <fieldset className="panel-section">
                <legend>Feature</legend>
                <FeaturePreview />
              </fieldset>
              <fieldset className="panel-section">
                <legend>Item Scaler</legend>
                <ItemScaler />
              </fieldset>
              <FeatureOptions />
              <FilterPanel />
            </div>
            <div className="center-panel">
              <fieldset className="panel-section canvas-section">
                <legend>Face Area</legend>
                <FaceCanvas />
              </fieldset>
              <fieldset className="panel-section variants-section">
                <legend>Variants</legend>
                <VariantStrip />
              </fieldset>
            </div>
            <div className="right-panel">
              <fieldset className="panel-section">
                <legend>Select</legend>
                <CategorySelector />
              </fieldset>
              <ActionButtons />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
      <WelcomeDialog />
    </div>
  );
}

export default App
