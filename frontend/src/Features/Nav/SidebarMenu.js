import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signout } from "../../Controllers/userActions";
import { sidebarMenuItems } from "./menuItemList";
import { MenuItem } from "./MenuItem";

import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { shortName } from "../../utils";

export default function SidebarMenu({ currency, shadowFor, setShadowFor }) {
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = useSelector((state) => state.productCategoryList);
  const { userInfo } = useSelector((state) => state.userSignin);
  const dispatch = useDispatch();

  return (
    <aside className={"sidebar" === shadowFor ? "sidebar opened" : "sidebar"}>
      <button onClick={() => setShadowFor("")} id="btn--close-sidebar">
        <div className="sprite__close-btn"></div>
      </button>

      <li onClick={() => setShadowFor("")}>
        <Link to="/profile" className="sidebar__header">
          <div className="sprite__user"></div>
          {"Hello, " + shortName(userInfo)}
        </Link>
      </li>

      <ul className="sidebar__list">
        {loadingCategories ? (
          <LoadingBox />
        ) : (
          <>
            <MessageBox variant="danger" msg={errorCategories} />
            {categories &&
              sidebarMenuItems(userInfo, currency, categories, () =>
                dispatch(signout())
              ).map(MenuItem(setShadowFor))}
          </>
        )}
      </ul>
    </aside>
  );
}
