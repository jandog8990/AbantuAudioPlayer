import React from 'react';
import { StyleSheet,View,ActivityIndicator,FlatList,Text,TouchableOpacity,Image } from 'react-native';
import { Icon } from 'react-native-elements';

// Shop list page for selecting books for cart
export default class ShopList extends React.Component {
	/*
	 * navigation - navigation props for screen, screen route at navigation.state
	 * screenProps - props passing from above navigator component
	 * navigationOptions - default or previous options that would be used if new values are not provided
	 */

	// Render the shop list
	constructor(props) {
		super(props)
		this.state = {
		  loading: false,
		  dataSource: [],
		 };
	}

	static navigationOptions = ({ navigation, navigationOptions }) => {
			//headerStyle: { backgroundColor: navigationOptions.headerTintColor },
		return {
			title: 'Shopping List',
			headerBackTitleVisible: false,	
			headerLeftContainerStyle: {paddingLeft: 20},	
			headerTitleStyle: { color: 'black' },	
			headerStyle: { backgroundColor: 'white' },
			headerTintColor: 'black' 
		};
	};


	componentDidMount() {this.fetchData();}
	  
	fetchData = () => {this.setState({loading: true});
	  
	fetch("https://jsonplaceholder.typicode.com/photos")
		.then(response => response.json())
			.then(responseJson => {
				responseJson = responseJson.map(item => {
					item.isSelect = false;
					item.selectedClass = styles.list;
					
					return item;
				});
			
				this.setState({
					loading: false,
					dataSource: responseJson,
				});
			}).catch(error => {this.setState({loading: false});
	   	});
	};
	
	FlatListItemSeparator = () => <View style={styles.line} />;
	
	selectItem = data => {

		console.log("Data Item")
		console.log(data.item)
		console.log("\n")

		console.log("Data Source")
		console.log(this.state.dataSource.length)
		console.log("\n")

		// Rset the datasources before selecting new
		const responseJson = this.state.dataSource.map(it => {
			it.isSelect = false;
			it.selectedClass = styles.list;
			
			return it;
		});

		/*
		this.setState({
			dataSource: responseJson 
		});
		*/
	
		//const responseJson = this.state.dataSource;
		console.log("Data Item")
		console.log(data.item.id)
		console.log("\n")
		
		//const index = this.state.dataSource.findIndex(
		const index = responseJson.findIndex(
			item => {
				if (data.item.id == item.id) {	
					console.log("item.id = " + item.id);	
					idx = data.item.id === item.id;
					console.log("idx = " + idx);
					console.log("data item:");
					console.log(data.item);	
					console.log("item:");	
					console.log(item);
					console.log("---------------------------------------");	
					console.log("\n")
				}	
				data.item.id === item.id
			}	
		);
		
		data.item.isSelect = !data.item.isSelect;
		data.item.selectedClass = data.item.isSelect ? styles.selected : styles.list;
	
		console.log("Index = " + index);
		console.log("Data Item")
		console.log(data.item)
		console.log("-------------------------------------")	
		console.log("\n")
		
		//this.state.dataSource[index] = data.item;
		responseJson[index] = data.item;

			//dataSource: this.state.dataSource,
		this.setState({
			dataSource: responseJson, 
		});
	};
	
	goToStore = () => this.props.navigation.navigate("Expenses", {selected: this.state.selected,});
	
	renderItem = data =>
	  <TouchableOpacity
		style={[styles.list, data.item.selectedClass]}      
		onPress={() => this.selectItem(data)}
	  >
	  <Image
		source={{ uri: data.item.thumbnailUrl }}
		style={{ width: 40, height: 40, margin: 6 }}
	  />
	  <Text style={styles.lightText}>  {data.item.title.charAt(0).toUpperCase() + data.item.title.slice(1)}  </Text>
	</TouchableOpacity>
	
	render() {
		const itemNumber = this.state.dataSource.filter(item => item.isSelect).length;
		if (this.state.loading) {
			return (
				<View style={styles.loader}>
					<ActivityIndicator size="large" color="purple" />
				</View>
			);
		}
	 
	 return (
		<View style={styles.container}>
		<Text style={styles.title}>EVERYONE gives a fuck :)</Text>
		<FlatList
			data={this.state.dataSource}
			ItemSeparatorComponent={this.FlatListItemSeparator}
			renderItem={item => this.renderItem(item)}
			keyExtractor={item => item.id.toString()}
			extraData={this.state}
		/>
		
		<View style={styles.numberBox}>
			<Text style={styles.number}>{itemNumber}</Text>
		</View>


		<TouchableOpacity style={styles.icon}>
			<View>
			<Icon
				raised
				name={Platform.OS === "ios" ? "ios-cart" : "md-cart"}
				color="black" 
				size={30} 
				onPress={() => this.goToStore()}
				containerStyle={{ backgroundColor: "#FA7B5F" }}
				type="ionicon"
			/>
			</View>
		</TouchableOpacity>
		</View>
	);
	}
}
	
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#192338",
		paddingVertical: 50,
		position: "relative"
	},
	title: {
		fontSize: 20,
		color: "#fff",
		textAlign: "center",
		marginBottom: 10
	},
	loader: {
		flex: 1, 
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff"
	},
	list: {
		paddingVertical: 5,
		margin: 3,
		flexDirection: "row",
		backgroundColor: "#192338",
		justifyContent: "flex-start",
		alignItems: "center",
		zIndex: -1
	},
	lightText: {
		color: "#f7f7f7",
		width: 200,
		paddingLeft: 15,
		fontSize: 12
	},
	line: {
		height: 0.5,
		width: "100%",
		backgroundColor:"rgba(255,255,255,0.5)"
	},
	icon: {
		position: "absolute",  
		bottom: 20,
		width: "100%", 
		left: 290, 
		zIndex: 1
	},
	numberBox: {
		position: "absolute",
		bottom: 75,
		width: 30,
		height: 30,
		borderRadius: 15,  
		left: 330,
		zIndex: 3,
		backgroundColor: "#e3e3e3",
		justifyContent: "center",
		alignItems: "center"
	},
	number: {fontSize: 14,color: "#000"},
	selected: {backgroundColor: "#FA7B5F"},
});
