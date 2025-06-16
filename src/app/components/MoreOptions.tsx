// src/components/MoreOptions.tsx
export function MoreOptions() {
    return (
      <div className="moreoptions">
        <div>
          <button><i className="bi bi-gear-wide"></i><span>Setting</span></button>
          <button><i className="bi bi-activity"></i><span>Your activity</span></button>
          <button><i className="bi bi-bookmark"></i><span>Saved</span></button>
          <button><i className="bi bi-brightness-low"></i><span>Switch appearance</span></button>
          <button><i className="bi bi-exclamation-square"></i><span>Report a problem</span></button>
        </div>
  
        <span className="gap"></span>
  
        <div>
          <button><i className="bi bi-threads"></i> <span>Threads</span></button>
        </div>
  
        <span className="gap"></span>
  
        <div><button><span>Switch accounts</span></button></div>
        <span id="gapid"></span>
        <div><button><span>Log out</span></button></div>
      </div>
    );
  }