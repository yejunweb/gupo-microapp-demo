import { defineComponent } from 'vue';
import './style.less';

export default defineComponent({
    name: 'GlobalIcon',
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        return () => (
            <svg class='gupoIcon' aria-hidden='true'>
                <use xlinkHref={`#icon-${props.name}`} />
            </svg>
        );
    },
});
