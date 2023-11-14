import PropTypes from 'prop-types';

import './Header.css';

const Header = ({title, subTitle}) => {
    return (
        <div className="header">
            <span className="title">{title}</span>
            <span className="sub-title">{subTitle}</span>
        </div>
    );
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
};

export default Header;
