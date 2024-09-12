
import vid from "../assets/main_video.mp4"
import img from "../assets/city.jpg";
const Search = () => {
    return (
        <header>
            <video src={vid} width={"100%"} autoPlay loop muted></video>
            <h2 className="header__title">Search it. Explore it. Buy it.</h2>
            <div className="search_card">
                <img src={img} width={350} alt="" />
                <div className="description">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut distinctio, voluptatum alias similique numquam perferendis odit, neque ducimus amet consectetur molestias dolorem fugit recusandae! Ad consectetur quo at molestiae quis sint. Ullam nostrum rem maxime consectetur deserunt? Modi ipsum sint, amet laborum sunt repudiandae architecto temporibus. Cumque, iure magni cum aperiam expedita quibusdam eaque? Voluptatum laudantium ducimus consequuntur, fugit pariatur aut  </p>
                </div>
            </div>
        </header>
    );
}

export default Search;