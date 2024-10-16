import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import {Home} from 'lucide-react';
import DNDCharts from "./components/charts";
import AGGridWithLocalStorage from "./components/g2-table";
import DataGridExample from "./components/react-data-grid-test";
import HandsontableExample from "./components/handsontable_exmaple";
import MarkdownEditor from "./components/markdown_exmaple";
import Flow from "./components/reactflow_exmaple";
import ReactLiveExample from "./components/react-live-example";
import JsonToRecharts from "./components/user_defined_charts";
import VisualEtlFlowWithStyles from "./components/react-flow-etl";
import ETLFlow from "./components/light-etl";

const NavLink = ({to, children}) => (
    <Link
        to={to}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-150 ease-in-out"
    >
        {children}
    </Link>
);

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                {/* Apple-style Navigation */}
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                {/*<div className="flex-shrink-0">*/}
                                {/*  <img className="h-8 w-8" src="/api/placeholder/32/32" alt="Logo"/>*/}
                                {/*</div>*/}
                                <div className="hidden md:block ml-10 flex items-baseline space-x-4">
                                    <NavLink to="/">Home</NavLink>
                                    <NavLink to="/dndtable">DND Table</NavLink>
                                    <NavLink to="/ag_table">ag-table</NavLink>
                                    <NavLink to="/HandsontableExample">HandsontableExample</NavLink>
                                    <NavLink to="/MarkdownEditor">MarkdownEditor</NavLink>
                                    <NavLink to="/ReactFlow">ReactFlow</NavLink>
                                    <NavLink to="/ReactLiveExample">ReactLiveExample</NavLink>
                                    <NavLink to="/JsonToRecharts">JsonToRecharts</NavLink>
                                    <NavLink to="/VisualEtlFlow">VisualEtlFlow</NavLink>
                                    <NavLink to="/ETLFlow">ETLFlow</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 border-2 mt-10 bg-blue-50">
                    <div className="px-4 py-6 sm:px-0">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/dndtable" element={<DNDCharts/>}/>
                            <Route path="/ag_table" element={<AGGridWithLocalStorage/>}/>
                            <Route path="/react-data-grid" element={<DataGridExample/>}/>
                            <Route path="/HandsontableExample" element={<HandsontableExample/>}/>
                            <Route path="/MarkdownEditor" element={<MarkdownEditor/>}/>
                            <Route path="/ReactFlow" element={<Flow/>}/>
                            <Route path="/ReactLiveExample" element={<ReactLiveExample/>}/>
                            <Route path="/JsonToRecharts" element={<JsonToRecharts/>}/>
                            <Route path="/VisualEtlFlow" element={<VisualEtlFlowWithStyles/>}/>
                            <Route path="/ETLFlow" element={<ETLFlow/>}/>
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;