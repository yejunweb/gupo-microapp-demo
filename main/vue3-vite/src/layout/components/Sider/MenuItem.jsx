import { defineComponent } from 'vue';
import { GlobalIcon } from '@src/components/UI';

export default defineComponent({
    name: 'LayoutMenuItem',
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        return () => (
            <div class='menu-item'>
                {props.data?.icon && <GlobalIcon class={'anticon'} name={props.data?.icon} />}
                <span>{props.data?.title}</span>
            </div>
        );
    },
});
