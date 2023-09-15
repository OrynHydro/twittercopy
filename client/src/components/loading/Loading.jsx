import './loading.css'

const Loading = () => {

    // declaring variable that helps to get images from folder directly without importing

    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    return (  
        <div className='loadingPage'>
            <img src={PF + 'logo/logo.png'} alt="" />
        </div>
    );
}

export default Loading;