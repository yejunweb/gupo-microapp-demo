import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import LayoutMenuItem from './MenuItem.jsx';
import { GupoMenuItem, GupoSubMenu } from '@src/components/UI';

export default defineComponent({
    name: 'LayoutMenu',
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const router = useRouter();

        return () =>
            props.data.children?.length ? (
                <GupoSubMenu key={props.data.path} title={<LayoutMenuItem data={props.data?.meta} />}>
                    {props.data.children.map(item => (
                        <LayoutMenu data={item} />
                    ))}
                </GupoSubMenu>
            ) : (
                <GupoMenuItem key={props.data.path} onClick={() => router.push(props.data.path)}>
                    <LayoutMenuItem data={props.data?.meta} />
                </GupoMenuItem>
            );
    },
});
