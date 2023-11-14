import PropTypes from 'prop-types';

import './legendCard.css';

const LegendCard = ({title, label, data}) => {
    return (
        <div className="legend-card">
            <span className="title">{title}</span>
            <span className="detail">{`${label}: ${data}`}</span>
        </div>
    );
};

LegendCard.propTypes = {
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
};

export default LegendCard;
